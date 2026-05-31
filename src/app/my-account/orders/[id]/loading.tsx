import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-surface-container pb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface p-6 md:p-8 rounded-DEFAULT border border-surface-container">
            <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b border-surface-container pb-4">
              Items Ordered
            </h2>
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-surface-container last:border-0 last:pb-0">
                  <Skeleton className="w-full sm:w-32 h-32 rounded-sm" />
                  <div className="flex flex-col justify-between flex-grow space-y-4 sm:space-y-0">
                    <div>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex justify-between items-end">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-surface p-6 md:p-8 rounded-DEFAULT border border-surface-container mt-8">
            <Skeleton className="h-8 w-48 mb-6 border-b border-surface-container pb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-4 w-20 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 relative">
          <div className="md:sticky top-32">
            <div className="bg-surface-container-low p-6 md:p-8 rounded-DEFAULT h-full border border-surface-container">
              <Skeleton className="h-8 w-40 mb-6 border-b border-surface-container pb-4" />
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-surface-container">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between pt-4 border-t border-surface-container">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
