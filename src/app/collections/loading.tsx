import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      {/* Header & Filtering Area Skeleton */}
      <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-2xl w-full">
          <Skeleton className="h-16 w-3/4 md:w-1/2 mb-4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6 mt-2" />
        </div>
        <div className="w-full md:w-auto flex items-center gap-6 border-b border-surface-container pb-4">
          <div className="flex gap-6 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-24" />
            ))}
          </div>
          <div className="ml-auto pl-6 border-l border-surface-container">
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </header>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <article key={i} className="flex flex-col mb-12 lg:mb-0">
            <Skeleton className="aspect-[3/4] w-full mb-6" />
            <div className="text-center flex flex-col items-center">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-5 w-20" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
