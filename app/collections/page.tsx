import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/lib/actions/collections";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

// Force dynamic so build doesn't attempt DB access without DATABASE_URL.
// At runtime with a real DB this renders on request and CDN caches it.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore our curated collections — seasonal, occasion, and gift sets.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="container py-8 lg:py-12">
      <h1 className="font-display text-3xl font-semibold text-espresso mb-2">
        Collections
      </h1>
      <p className="text-muted-foreground mb-8">
        Curated selections for every occasion.
      </p>

      {collections.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No collections available right now. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {collection.imageUrl ? (
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-cream to-sand">
                    <span className="font-display text-2xl text-espresso/40">
                      {collection.name.charAt(0)}
                    </span>
                  </div>
                )}
                {collection.featured && (
                  <div className="absolute left-3 top-3">
                    <Badge variant="gold">Featured</Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-medium text-foreground group-hover:text-espresso transition-colors">
                  {collection.name}
                </h2>
                {collection.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-espresso">
                  Shop collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
