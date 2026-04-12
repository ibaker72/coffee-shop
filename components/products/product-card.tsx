import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { ProductWithVariants } from "@/types";
import { formatPrice, discountPercent, getProductImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: ProductWithVariants;
}

export function ProductCard({ product }: ProductCardProps) {
  const displayVariant = product.variants[0]; // sorted by isDefault desc, price asc
  const imageUrl = getProductImageUrl(
    product.thumbnailUrl ?? product.images[0] ?? null
  );
  const hasDiscount =
    displayVariant?.compareAt != null &&
    displayVariant.compareAt > displayVariant.price;
  const isLowStock =
    displayVariant != null &&
    displayVariant.stock > 0 &&
    displayVariant.stock <= displayVariant.lowStock;
  const isOutOfStock =
    product.variants.length === 0 ||
    product.variants.every((v) => v.stock === 0);

  const reviewCount = product._count?.reviews ?? 0;
  const rating = product.avgRating ?? 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md hover-lift"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.featured && (
            <Badge variant="gold" className="text-[10px]">
              Featured
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive" className="text-[10px]">
              {discountPercent(displayVariant.compareAt!, displayVariant.price)}% off
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-[10px]">
              Out of Stock
            </Badge>
          )}
          {!isOutOfStock && isLowStock && (
            <Badge variant="secondary" className="text-[10px]">
              Low Stock
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs text-muted-foreground">{product.category.name}</p>
        <h3 className="mt-1 text-sm font-medium leading-tight text-foreground line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        {reviewCount > 0 && rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex text-gold">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.round(rating) ? "fill-current" : "fill-muted stroke-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          {displayVariant ? (
            <>
              <span className="text-sm font-semibold text-foreground">
                {formatPrice(displayVariant.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(displayVariant.compareAt!)}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
