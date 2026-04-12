"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProductImageUrl } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const safeImages = images.length > 0 ? images : [null];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = getProductImageUrl(safeImages[activeIndex] ?? null);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
        <Image
          key={activeImage}
          src={activeImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover animate-fade-in"
        />
      </div>

      {/* Thumbnails — only shown when there's more than one image */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => {
            const thumb = getProductImageUrl(img ?? null, 200, 200);
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                  idx === activeIndex
                    ? "border-espresso"
                    : "border-border hover:border-muted-foreground"
                )}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={thumb}
                  alt={`${name} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
