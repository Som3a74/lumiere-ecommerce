import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="flex-grow w-full pb-24">
      {/* Hero Skeleton */}
      <Skeleton className="w-full h-[60vh] mb-24" />
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-32">
        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="aspect-square w-full" />
        </div>
        
        {/* Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Skeleton className="aspect-square w-full" />
          <div>
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
