import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="border border-surface-container rounded-md p-8 max-w-2xl">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-12 w-32 mt-8" />
        </div>
      </div>
    </div>
  );
}
