import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  buildUrl: (page: number) => string;
}

export function Pagination({ page, totalPages, buildUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // Show a window of pages around the current page
  const pages: (number | "ellipsis")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (
      (i === 2 && page > 3) ||
      (i === totalPages - 1 && page < totalPages - 2)
    ) {
      pages.push("ellipsis");
    }
  }
  // Dedupe consecutive ellipsis
  const deduped = pages.filter(
    (v, i) => !(v === "ellipsis" && pages[i - 1] === "ellipsis")
  );

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Button variant="outline" size="icon" asChild disabled={!hasPrev}>
        <Link
          href={hasPrev ? buildUrl(page - 1) : "#"}
          aria-disabled={!hasPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {deduped.map((item, idx) =>
        item === "ellipsis" ? (
          <span key={`ell-${idx}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "outline"}
            size="icon"
            asChild
          >
            <Link href={buildUrl(item)} aria-current={item === page ? "page" : undefined}>
              {item}
            </Link>
          </Button>
        )
      )}

      <Button variant="outline" size="icon" asChild disabled={!hasNext}>
        <Link
          href={hasNext ? buildUrl(page + 1) : "#"}
          aria-disabled={!hasNext}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </nav>
  );
}
