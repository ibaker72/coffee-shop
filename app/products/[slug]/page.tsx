import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/actions/products";
import { ProductGallery } from "@/components/products/product-gallery";
import { VariantSelector } from "@/components/products/variant-selector";
import { ReviewsSection } from "@/components/products/reviews-section";
import { RelatedProducts } from "@/components/products/related-products";
import { Separator } from "@/components/ui/separator";
import { BRAND_NAME } from "@/lib/constants";

// ISR: revalidate product pages every 60 seconds
export const revalidate = 60;

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle ?? product.name,
    description:
      product.metaDescription ??
      product.shortDescription ??
      `Buy ${product.name} from ${BRAND_NAME}. Specialty coffee and tea rooted in tradition.`,
    openGraph: {
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.shortDescription ?? "",
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="container py-8 lg:py-12">
      {/* Main product section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Details */}
        <div className="flex flex-col gap-6">
          <VariantSelector product={product} />

          {/* Story / Long description */}
          {(product.story || product.description) && (
            <div className="mt-4">
              <Separator className="mb-6" />
              {product.story && (
                <>
                  <h2 className="font-display text-lg font-semibold text-espresso mb-2">
                    The Story
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                    {product.story}
                  </p>
                </>
              )}
              {product.description && !product.story && (
                <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                  {product.description}
                </p>
              )}
            </div>
          )}

          {/* Serving suggestion */}
          {product.servingSuggestion && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Serving Suggestion
              </p>
              <p className="text-sm text-foreground/80">
                {product.servingSuggestion}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <ReviewsSection
        reviews={product.reviews}
        count={product._count.reviews}
        avgRating={product.avgRating}
      />

      {/* Related products */}
      <RelatedProducts products={related} />
    </div>
  );
}
