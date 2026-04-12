import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionLoading() {
  return (
    <div className="container py-8 lg:py-12">
      <Skeleton className="mb-8 h-48 w-full rounded-xl sm:h-64" />
      <Skeleton className="mb-6 h-4 w-24" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
