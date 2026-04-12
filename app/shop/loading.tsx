import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container py-8 lg:py-12">
      <Skeleton className="h-9 w-24 mb-2" />
      <Skeleton className="h-4 w-40 mb-8" />
      <div className="flex gap-8">
        <div className="w-56 shrink-0 space-y-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-5 w-24 mt-4" />
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="rounded-lg border overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
