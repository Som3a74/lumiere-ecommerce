import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* Left Column: Checkout Steps Skeleton */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-8">
        <div className="border-b border-surface-container pb-4">
          <Skeleton className="h-10 w-64 mb-4" />
        </div>

        {/* Accordions Skeleton */}
        {[1, 2, 3].map((step) => (
          <div key={step} className="border-b border-surface-container pb-6">
            <div className="flex justify-between items-center py-4">
              <Skeleton className="h-8 w-1/2 md:w-1/3" />
              <Skeleton className="h-6 w-6" />
            </div>
            {/* Show expanded skeleton only for the first step */}
            {step === 1 && (
              <div className="pt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-12 w-48" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Column: Sticky Order Summary Skeleton */}
      <div className="lg:col-span-5 xl:col-span-4 relative">
        <div className="md:sticky top-32 bg-surface-container-low p-8 rounded-md">
          <Skeleton className="h-8 w-48 mb-6" />
          
          {/* Item Preview Skeleton */}
          <div className="flex gap-4 mb-6 pb-6 border-b border-surface-container">
            <Skeleton className="w-24 h-24 flex-shrink-0" />
            <div className="flex flex-col justify-between flex-grow py-1">
              <div>
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          {/* Totals Skeleton */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between pt-4 border-t border-surface-container">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          {/* CTA Skeleton */}
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
