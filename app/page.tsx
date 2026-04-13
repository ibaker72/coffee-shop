import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { getFeaturedProducts } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      {/* Hero */}
      <section className="container flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-4xl font-semibold text-espresso sm:text-5xl lg:text-6xl">
          {BRAND_NAME}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{BRAND_TAGLINE}</p>
        <Button className="mt-8" size="lg" asChild>
          <Link href="/shop">Shop Now</Link>
        </Button>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="container py-8 lg:py-12">
          <h2 className="font-display text-2xl font-semibold text-espresso mb-6">
            Featured Products
          </h2>
          <ProductGrid products={featured} />
        </section>
      )}
    </>
  );
}
