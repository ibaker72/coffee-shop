import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCollectionBySlug } from "@/lib/actions/collections";
import { ProductGrid } from "@/components/products/product-grid";
import { BRAND_NAME } from "@/lib/constants";

// ISR: revalidate collection pages every 5 minutes
export const revalidate = 300;

interface CollectionPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) return { title: "Collection Not Found" };

  return {
    title: collection.name,
    description:
      collection.description ??
      `Shop the ${collection.name} collection at ${BRAND_NAME}.`,
    openGraph: {
      title: collection.name,
      description: collection.description ?? "",
      images: collection.imageUrl ? [{ url: collection.imageUrl }] : [],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const products = collection.products.map((cp) => cp.product);

  return (
    <div className="container py-8 lg:py-12">
      {/* Hero banner */}
      {collection.imageUrl && (
        <div className="relative mb-8 h-48 w-full overflow-hidden rounded-xl sm:h-64">
          <Image
            src={collection.imageUrl}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-espresso/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-2 max-w-xl text-sm text-white/80">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Text header — shown when no image */}
      {!collection.imageUrl && (
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-espresso">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="mt-2 text-muted-foreground">{collection.description}</p>
          )}
        </div>
      )}

      <p className="mb-6 text-sm text-muted-foreground">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      <ProductGrid
        products={products}
        emptyMessage="This collection has no products yet."
      />
    </div>
  );
}
