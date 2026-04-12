import type { ProductWithVariants } from "@/types";
import { ProductCard } from "./product-card";
import { Separator } from "@/components/ui/separator";

interface RelatedProductsProps {
  products: ProductWithVariants[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <Separator className="mb-8" />
      <h2 className="font-display text-2xl font-semibold text-espresso">
        You May Also Like
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
