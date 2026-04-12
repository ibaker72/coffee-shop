import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/actions/products";
import { parseShopParams, buildShopUrl } from "@/lib/shop-params";
import { ProductGrid } from "@/components/products/product-grid";
import { FiltersPanel } from "@/components/products/filters-panel";
import { SortSelect } from "@/components/products/sort-select";
import { Pagination } from "@/components/products/pagination";
import { Skeleton } from "@/components/ui/skeleton";

// searchParams already opts this into dynamic rendering in Next.js 14;
// stated explicitly for clarity.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our full range of specialty coffee, tea, and gift sets.",
};

interface ShopPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters = parseShopParams(searchParams);
  const { products, total, page, totalPages } = await getProducts(filters);

  const buildUrl = (p: number) => buildShopUrl({ ...filters, page: p });

  return (
    <div className="container py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-espresso">
          Shop
        </h1>
        <p className="mt-1 text-muted-foreground">
          {total} {total === 1 ? "product" : "products"}
          {filters.search ? ` for "${filters.search}"` : ""}
          {filters.category
            ? ` in ${filters.category.charAt(0) + filters.category.slice(1).toLowerCase().replace("_", " ")}`
            : ""}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters — wrap in Suspense because SortSelect uses useSearchParams */}
        <Suspense fallback={<div className="w-56 space-y-3"><Skeleton className="h-6 w-32" /><Skeleton className="h-40 w-full" /></div>}>
          <FiltersPanel currentFilters={filters} />
        </Suspense>

        {/* Grid + sort */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Page {page} of {Math.max(totalPages, 1)}
            </span>
            <Suspense fallback={null}>
              <SortSelect currentSort={filters.sort} />
            </Suspense>
          </div>

          <ProductGrid products={products} />

          <Pagination
            page={page}
            totalPages={totalPages}
            buildUrl={buildUrl}
          />
        </div>
      </div>
    </div>
  );
}
