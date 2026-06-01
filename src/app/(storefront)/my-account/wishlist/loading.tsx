import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item}>
            <Skeleton className="aspect-[3/4] w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
