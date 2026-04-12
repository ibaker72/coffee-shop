import { db } from "@/lib/db";
import { isCollectionActive } from "@/lib/utils";
import type { CollectionWithProducts, ProductWithVariants } from "@/types";
import type { Prisma } from "@prisma/client";
import type { Collection } from "@prisma/client";

const productCardInclude = {
  category: true,
  variants: {
    where: { active: true },
    orderBy: [{ isDefault: "desc" as const }, { price: "asc" as const }],
  },
  _count: {
    select: { reviews: { where: { approved: true } } },
  },
} satisfies Prisma.ProductInclude;

// ─────────────────────────────────────────────────────────────────────────────
// getCollections — active collections for /collections listing
// ─────────────────────────────────────────────────────────────────────────────

export async function getCollections(): Promise<Collection[]> {
  const collections = await db.collection.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  // Filter by date range in memory (avoids complex DB date comparisons with
  // nullable fields while keeping the query simple)
  return collections.filter((c) =>
    isCollectionActive(c.startDate, c.endDate)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// getCollectionBySlug — collection detail with products in sortOrder
// ─────────────────────────────────────────────────────────────────────────────

export async function getCollectionBySlug(
  slug: string
): Promise<CollectionWithProducts | null> {
  const collection = await db.collection.findUnique({
    where: { slug, active: true },
    include: {
      products: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: {
            include: productCardInclude,
          },
        },
      },
    },
  });

  if (!collection) return null;
  if (!isCollectionActive(collection.startDate, collection.endDate)) return null;

  // Shape to CollectionWithProducts
  return {
    ...collection,
    products: collection.products.map((cp) => ({
      sortOrder: cp.sortOrder,
      product: cp.product as unknown as ProductWithVariants,
    })),
  } as CollectionWithProducts;
}
