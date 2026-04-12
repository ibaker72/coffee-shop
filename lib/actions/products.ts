import { db } from "@/lib/db";
import { PRODUCTS_PER_PAGE, RELATED_PRODUCTS_COUNT } from "@/lib/constants";
import type { ProductWithVariants, ProductWithDetails, ShopFilters } from "@/types";
import type { Prisma } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Shared include shapes
// ─────────────────────────────────────────────────────────────────────────────

const productCardInclude = {
  category: true,
  variants: {
    where: { active: true },
    orderBy: [{ isDefault: "desc" as const }, { price: "asc" as const }],
  },
  _count: {
    select: {
      reviews: { where: { approved: true } },
    },
  },
} satisfies Prisma.ProductInclude;

// ─────────────────────────────────────────────────────────────────────────────
// getProducts
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductsResult {
  products: ProductWithVariants[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getProducts(filters: ShopFilters): Promise<ProductsResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = PRODUCTS_PER_PAGE;

  const where: Prisma.ProductWhereInput = {
    active: true,
    ...(filters.category && { category_type: filters.category }),
    ...(filters.productType && { productType: filters.productType }),
    ...(filters.roastLevel && { roastLevel: filters.roastLevel }),
    ...(filters.origin && { origin: filters.origin }),
    ...(filters.featured && { featured: true }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { shortDescription: { contains: filters.search, mode: "insensitive" } },
        { origin: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.minPrice != null || filters.maxPrice != null
      ? {
          variants: {
            some: {
              active: true,
              price: {
                ...(filters.minPrice != null && { gte: filters.minPrice }),
                ...(filters.maxPrice != null && { lte: filters.maxPrice }),
              },
            },
          },
        }
      : {}),
  };

  // Price sorting requires a two-step query since Prisma doesn't support
  // orderBy on related scalar aggregates (only _count).
  if (filters.sort === "price-asc" || filters.sort === "price-desc") {
    return getProductsSortedByPrice(where, filters.sort, page, pageSize);
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    filters.sort === "newest"
      ? [{ createdAt: "desc" }]
      : filters.sort === "name-asc"
      ? [{ name: "asc" }]
      : [{ featured: "desc" }, { createdAt: "desc" }]; // default: featured

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: productCardInclude,
    }),
    db.product.count({ where }),
  ]);

  return {
    products: products as unknown as ProductWithVariants[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

async function getProductsSortedByPrice(
  where: Prisma.ProductWhereInput,
  sort: "price-asc" | "price-desc",
  page: number,
  pageSize: number
): Promise<ProductsResult> {
  // 1. Get all matching product IDs
  const allIds = await db.product.findMany({
    where,
    select: { id: true },
  });
  const idSet = allIds.map((p) => p.id);

  if (idSet.length === 0) {
    return { products: [], total: 0, page, pageSize, totalPages: 0 };
  }

  // 2. Get min price per product
  const priceGroups = await db.productVariant.groupBy({
    by: ["productId"],
    _min: { price: true },
    where: { productId: { in: idSet }, active: true },
  });

  // 3. Sort by price
  priceGroups.sort((a, b) => {
    const aP = a._min.price ?? 0;
    const bP = b._min.price ?? 0;
    return sort === "price-asc" ? aP - bP : bP - aP;
  });

  const total = priceGroups.length;
  const skip = (page - 1) * pageSize;
  const pageIds = priceGroups.slice(skip, skip + pageSize).map((g) => g.productId);

  if (pageIds.length === 0) {
    return { products: [], total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  // 4. Load full data for this page, preserve sort order
  const rows = await db.product.findMany({
    where: { id: { in: pageIds } },
    include: productCardInclude,
  });

  const ordered = pageIds
    .map((id) => rows.find((r) => r.id === id))
    .filter(Boolean) as typeof rows;

  return {
    products: ordered as unknown as ProductWithVariants[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getProductBySlug
// ─────────────────────────────────────────────────────────────────────────────

export async function getProductBySlug(
  slug: string
): Promise<ProductWithDetails | null> {
  const product = await db.product.findUnique({
    where: { slug, active: true },
    include: {
      category: true,
      variants: {
        where: { active: true },
        orderBy: [{ isDefault: "desc" }, { price: "asc" }],
      },
      reviews: {
        where: { approved: true },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: {
        select: { reviews: { where: { approved: true } } },
      },
    },
  });

  if (!product) return null;

  const { _avg } = await db.review.aggregate({
    where: { productId: product.id, approved: true },
    _avg: { rating: true },
  });

  return {
    ...product,
    avgRating: _avg.rating ?? 0,
  } as unknown as ProductWithDetails;
}

// ─────────────────────────────────────────────────────────────────────────────
// getRelatedProducts
// ─────────────────────────────────────────────────────────────────────────────

export async function getRelatedProducts(
  product: { id: string; categoryId: string; category_type: string }
): Promise<ProductWithVariants[]> {
  const related = await db.product.findMany({
    where: {
      active: true,
      id: { not: product.id },
      category_type: product.category_type as ProductWithVariants["category_type"],
    },
    take: RELATED_PRODUCTS_COUNT,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: productCardInclude,
  });

  return related as unknown as ProductWithVariants[];
}

// ─────────────────────────────────────────────────────────────────────────────
// getFeaturedProducts  (used on homepage)
// ─────────────────────────────────────────────────────────────────────────────

export async function getFeaturedProducts(
  limit = 8
): Promise<ProductWithVariants[]> {
  const products = await db.product.findMany({
    where: { active: true, featured: true },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: productCardInclude,
  });

  return products as unknown as ProductWithVariants[];
}
