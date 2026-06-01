import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      <Skeleton className="h-12 w-48 mb-12" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 flex flex-col space-y-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-6 pb-8 border-b border-surface-container">
              <Skeleton className="w-32 h-32 flex-shrink-0" />
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex justify-between items-end mt-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-4 relative mt-12 lg:mt-0">
          <div className="md:sticky top-32 bg-surface-container-low p-8 rounded-md">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-t border-surface-container pt-4 mt-8">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
