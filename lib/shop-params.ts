import type { ShopFilters, SortOption } from "@/types";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

type RawParams = Record<string, string | string[] | undefined>;

const VALID_SORT: SortOption[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
];

const VALID_CATEGORY = ["COFFEE", "TEA", "GIFT_SET", "ACCESSORY"] as const;
const VALID_ROAST = [
  "LIGHT",
  "MEDIUM_LIGHT",
  "MEDIUM",
  "MEDIUM_DARK",
  "DARK",
  "EXTRA_DARK",
] as const;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseShopParams(params: RawParams): ShopFilters {
  const category = first(params.category);
  const sort = first(params.sort);
  const page = first(params.page);
  const roast = first(params.roast);
  const minPrice = first(params.minPrice);
  const maxPrice = first(params.maxPrice);
  const featured = first(params.featured);
  const search = first(params.q)?.trim();

  const parsedPage = parseInt(page ?? "1", 10);

  return {
    category: VALID_CATEGORY.includes(
      category as (typeof VALID_CATEGORY)[number]
    )
      ? (category as ShopFilters["category"])
      : undefined,
    roastLevel: VALID_ROAST.includes(roast as (typeof VALID_ROAST)[number])
      ? (roast as ShopFilters["roastLevel"])
      : undefined,
    sort: VALID_SORT.includes(sort as SortOption)
      ? (sort as SortOption)
      : "featured",
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    // prices come in as £ from the URL, stored as pence
    minPrice:
      minPrice && /^\d+$/.test(minPrice)
        ? parseInt(minPrice, 10) * 100
        : undefined,
    maxPrice:
      maxPrice && /^\d+$/.test(maxPrice)
        ? parseInt(maxPrice, 10) * 100
        : undefined,
    featured: featured === "true" ? true : undefined,
    search: search || undefined,
  };
}

/** Build a /shop URL from a partial filter object. */
export function buildShopUrl(filters: Partial<ShopFilters>): string {
  const p = new URLSearchParams();
  if (filters.category) p.set("category", filters.category);
  if (filters.roastLevel) p.set("roast", filters.roastLevel);
  if (filters.sort && filters.sort !== "featured") p.set("sort", filters.sort);
  if (filters.page && filters.page > 1) p.set("page", String(filters.page));
  if (filters.minPrice) p.set("minPrice", String(filters.minPrice / 100));
  if (filters.maxPrice) p.set("maxPrice", String(filters.maxPrice / 100));
  if (filters.featured) p.set("featured", "true");
  if (filters.search) p.set("q", filters.search);
  const qs = p.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export { PRODUCTS_PER_PAGE };
