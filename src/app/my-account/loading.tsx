import { Skeleton } from "@/components/ui/skeleton";

export default function MyAccountLoading() {
  return (
    <div className="pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      <div className="mb-16 text-center md:text-left">
        <Skeleton className="h-12 md:h-16 w-64 mb-4 mx-auto md:mx-0" />
        <Skeleton className="h-6 w-48 mx-auto md:mx-0" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Sidebar Navigation Skeleton */}
        <aside className="col-span-1 md:col-span-3 mb-12 md:mb-0">
          <nav className="flex flex-col space-y-2 md:sticky md:top-32">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
            <Skeleton className="h-6 w-24 mt-8 mx-4" />
          </nav>
        </aside>

        {/* Main Content Area Skeleton */}
        <div className="col-span-1 md:col-span-9 space-y-24">
          {/* Order History Table Skeleton */}
          <section>
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Table Header */}
                <div className="flex border-b-2 border-primary pb-4 mb-4">
                  <Skeleton className="h-4 w-1/5 mr-4" />
                  <Skeleton className="h-4 w-1/5 mr-4" />
                  <Skeleton className="h-4 w-1/5 mr-4" />
                  <Skeleton className="h-4 w-1/5 mr-4" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
                {/* Table Rows */}
                {[1, 2, 3].map((row) => (
                  <div key={row} className="flex py-6 border-b border-surface-container">
                    <Skeleton className="h-6 w-1/5 mr-4" />
                    <Skeleton className="h-6 w-1/5 mr-4" />
                    <Skeleton className="h-8 w-24 mr-4" />
                    <Skeleton className="h-6 w-1/5 mr-4" />
                    <Skeleton className="h-6 w-20 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Wishlist Preview Skeleton */}
          <section>
            <div className="flex justify-between items-end border-b border-surface-container pb-4 mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className={i === 2 ? "hidden sm:block" : ""}>
                  <Skeleton className="aspect-[3/4] w-full mb-6" />
                  <div className="text-center flex flex-col items-center">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
