"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useCallback } from "react";
import { X } from "lucide-react";
import { PRODUCT_CATEGORIES, ROAST_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ShopFilters } from "@/types";

interface FiltersPanelProps {
  currentFilters: ShopFilters;
}

export function FiltersPanel({ currentFilters }: FiltersPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page"); // reset pagination on filter change
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  function clearAll() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasActiveFilters =
    currentFilters.category ||
    currentFilters.roastLevel ||
    currentFilters.search ||
    currentFilters.featured;

  return (
    <aside
      className={cn(
        "w-56 shrink-0 space-y-5 text-sm",
        isPending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Search */}
      <div>
        <h3 className="mb-2 font-medium">Search</h3>
        <Input
          placeholder="Search products…"
          defaultValue={currentFilters.search ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("q", (e.target as HTMLInputElement).value || null);
            }
          }}
          onBlur={(e) => {
            const val = e.target.value;
            if (val !== (currentFilters.search ?? "")) {
              updateParam("q", val || null);
            }
          }}
        />
      </div>

      <Separator />

      {/* Category */}
      <div>
        <h3 className="mb-2 font-medium">Category</h3>
        <ul className="space-y-1">
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = currentFilters.category === cat.value;
            return (
              <li key={cat.value}>
                <button
                  onClick={() =>
                    updateParam("category", active ? null : cat.value)
                  }
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                    active
                      ? "font-medium text-espresso bg-muted"
                      : "text-foreground/80"
                  )}
                >
                  {active && <X className="h-3 w-3 shrink-0" />}
                  {cat.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Separator />

      {/* Roast Level — only relevant for coffee */}
      <div>
        <h3 className="mb-2 font-medium">Roast Level</h3>
        <ul className="space-y-1">
          {ROAST_LEVELS.map((roast) => {
            const active = currentFilters.roastLevel === roast.value;
            return (
              <li key={roast.value}>
                <button
                  onClick={() =>
                    updateParam("roast", active ? null : roast.value)
                  }
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                    active
                      ? "font-medium text-espresso bg-muted"
                      : "text-foreground/80"
                  )}
                >
                  {active && <X className="h-3 w-3 shrink-0" />}
                  {roast.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Separator />

      {/* Featured toggle */}
      <div>
        <button
          onClick={() =>
            updateParam("featured", currentFilters.featured ? null : "true")
          }
          className={cn(
            "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
            currentFilters.featured
              ? "font-medium text-espresso bg-muted"
              : "text-foreground/80"
          )}
        >
          {currentFilters.featured && <X className="h-3 w-3 shrink-0" />}
          Featured Only
        </button>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={clearAll}
          >
            Clear All Filters
          </Button>
        </>
      )}
    </aside>
  );
}
