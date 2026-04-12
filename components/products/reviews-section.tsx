import { Star } from "lucide-react";
import type { ReviewWithUser } from "@/types";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ReviewsSectionProps {
  reviews: ReviewWithUser[];
  count: number;
  avgRating: number;
}

export function ReviewsSection({
  reviews,
  count,
  avgRating,
}: ReviewsSectionProps) {
  return (
    <section className="mt-16">
      <Separator className="mb-8" />
      <h2 className="font-display text-2xl font-semibold text-espresso">
        Customer Reviews
      </h2>

      {count === 0 ? (
        <p className="mt-4 text-muted-foreground">
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <>
          {/* Summary */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex text-gold">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(avgRating) ? "fill-current" : "stroke-muted-foreground fill-none"}`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              based on {count} {count === 1 ? "review" : "reviews"}
            </span>
          </div>

          {/* Review list */}
          <ul className="mt-6 space-y-6">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-border pb-6 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex text-gold">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-current" : "stroke-muted-foreground fill-none"}`}
                          />
                        ))}
                      </div>
                      {review.title && (
                        <span className="text-sm font-medium">
                          {review.title}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                      {review.body}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {review.user.name ?? "Anonymous"} ·{" "}
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
