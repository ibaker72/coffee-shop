import type { ProductWithVariants } from "@/types";
import { ProductCard } from "./product-card";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductGridProps {
  products: ProductWithVariants[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <div>
          <p className="font-medium text-foreground">{emptyMessage}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/shop">Clear Filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
