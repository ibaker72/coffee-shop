"use client";

import { useState } from "react";
import type { ProductVariant } from "@prisma/client";
import type { ProductWithVariants } from "@/types";
import { formatPrice, discountPercent } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart-button";

interface VariantSelectorProps {
  product: ProductWithVariants;
}

export function VariantSelector({ product }: VariantSelectorProps) {
  const variants = product.variants;
  const defaultVariant =
    variants.find((v) => v.isDefault) ?? variants[0] ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultVariant?.id ?? null
  );

  const selected = variants.find((v) => v.id === selectedId) ?? defaultVariant;
  const isOutOfStock = !selected || selected.stock === 0;
  const isLowStock =
    selected != null &&
    selected.stock > 0 &&
    selected.stock <= LOW_STOCK_THRESHOLD;
  const hasDiscount =
    selected?.compareAt != null && selected.compareAt > selected.price;

  const cartItem = selected
    ? {
        id: `${product.id}-${selected.id}`,
        productId: product.id,
        variantId: selected.id,
        productName: product.name,
        variantName: selected.name,
        productSlug: product.slug,
        imageUrl: product.thumbnailUrl ?? product.images[0] ?? null,
        unitPrice: selected.price,
        compareAt: selected.compareAt ?? null,
      }
    : null;

  return (
    <div className="space-y-5">
      {/* Name & category */}
      <div>
        <p className="text-sm text-muted-foreground">{product.category.name}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-espresso">
          {product.name}
        </h1>
        {product.origin && (
          <p className="mt-1 text-sm text-muted-foreground">
            Origin: {product.origin}
            {product.region ? `, ${product.region}` : ""}
          </p>
        )}
      </div>

      {/* Price */}
      {selected && (
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-foreground">
            {formatPrice(selected.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(selected.compareAt!)}
              </span>
              <Badge variant="destructive">
                {discountPercent(selected.compareAt!, selected.price)}% off
              </Badge>
            </>
          )}
        </div>
      )}

      {/* Short description */}
      {product.shortDescription && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
      )}

      {/* Variant buttons */}
      {variants.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            {selected ? selected.name : "Select option"}
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <VariantButton
                key={variant.id}
                variant={variant}
                selected={variant.id === selectedId}
                onSelect={() => setSelectedId(variant.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stock badges */}
      {isLowStock && (
        <Badge variant="secondary" className="text-xs">
          Only {selected!.stock} left in stock
        </Badge>
      )}

      {/* Flavour notes */}
      {product.flavorNotes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tasting Notes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.flavorNotes.map((note) => (
              <span
                key={note}
                className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs capitalize"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart */}
      {cartItem && (
        <AddToCartButton
          item={cartItem}
          outOfStock={isOutOfStock}
          disabled={!selected}
        />
      )}

      {/* Brew methods */}
      {product.brewMethods.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Brew methods: </span>
          {product.brewMethods.join(", ")}
        </p>
      )}
    </div>
  );
}

function VariantButton({
  variant,
  selected,
  onSelect,
}: {
  variant: ProductVariant;
  selected: boolean;
  onSelect: () => void;
}) {
  const outOfStock = variant.stock === 0;
  return (
    <button
      onClick={onSelect}
      disabled={outOfStock}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm transition-colors",
        selected
          ? "border-espresso bg-espresso text-espresso-foreground"
          : "border-border hover:border-espresso/50 bg-background",
        outOfStock && "opacity-40 cursor-not-allowed line-through"
      )}
    >
      {variant.name}
    </button>
  );
}
