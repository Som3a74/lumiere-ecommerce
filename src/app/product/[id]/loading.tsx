export default function ProductSkeleton() {
  return (
    <div className="max-w-container-max mx-auto pb-section-gap animate-pulse">
      {/* Breadcrumbs */}
      <div className="px-margin-mobile md:px-margin-desktop py-8 flex gap-2 items-center">
        <div className="h-4 w-12 bg-surface-dim rounded"></div>
        <span className="text-surface-dim">/</span>
        <div className="h-4 w-24 bg-surface-dim rounded"></div>
        <span className="text-surface-dim">/</span>
        <div className="h-4 w-32 bg-surface-dim rounded"></div>
      </div>

      {/* Product Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop mb-section-gap">
        {/* Left: Gallery Skeleton */}
        <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-6 items-start h-fit">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto w-full md:w-24 shrink-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-24 md:w-24 md:h-32 shrink-0 bg-surface-dim rounded-sm"></div>
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full aspect-[4/5] md:aspect-square bg-surface-dim rounded-sm"></div>
        </div>

        {/* Right: Product Info Skeleton */}
        <div className="md:col-span-5 md:pl-8 flex flex-col">
          <div className="mb-8 space-y-4">
            <div className="h-4 w-24 bg-surface-dim rounded mb-2"></div>
            <div className="h-10 w-3/4 bg-surface-dim rounded mb-4"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-surface-dim rounded"></div>
              <div className="h-4 w-full bg-surface-dim rounded"></div>
              <div className="h-4 w-2/3 bg-surface-dim rounded"></div>
            </div>
            <div className="h-6 w-32 bg-surface-dim rounded"></div>
          </div>

          {/* Variations */}
          <div className="mb-8 space-y-4">
            <div className="h-4 w-20 bg-surface-dim rounded mb-4"></div>
            <div className="flex gap-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="w-10 h-10 rounded-full bg-surface-dim"></div>
               ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-10 space-y-4">
            <div className="h-4 w-16 bg-surface-dim rounded mb-4"></div>
            <div className="flex gap-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="px-8 py-4 bg-surface-dim rounded-sm"></div>
               ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-12">
            <div className="w-full h-14 bg-surface-dim rounded-sm"></div>
            <div className="w-full h-10 bg-surface-dim rounded-sm mt-2"></div>
          </div>

          {/* Accordions */}
          <div className="w-full border-t border-b border-surface-container py-8 space-y-8">
             <div className="h-6 w-1/3 bg-surface-dim rounded"></div>
             <div className="h-6 w-1/4 bg-surface-dim rounded"></div>
             <div className="h-6 w-1/2 bg-surface-dim rounded"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
