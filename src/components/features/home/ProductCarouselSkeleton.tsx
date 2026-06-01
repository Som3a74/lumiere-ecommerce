export function ProductCarouselSkeleton({ title }: { title: string }) {
  // Creating an array of 4 items for the skeleton loaders
  const skeletons = Array(4).fill(0);

  return (
    <section className="py-section-gap bg-surface px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="max-w-container-max mx-auto fade-in-section">
        <div className="flex justify-between items-end mb-12 border-b border-surface-container pb-4">
          <h2 className="font-headline-lg text-headline-lg text-primary">{title}</h2>
          <div className="flex gap-4">
            <button disabled className="p-2 border border-surface-container rounded opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button disabled className="p-2 border border-surface-container rounded opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        
        <div className="flex gap-8 overflow-x-hidden pb-8">
          {skeletons.map((_, index) => (
            <div key={index} className="min-w-[280px] md:min-w-[320px] animate-pulse">
              <div className="bg-surface-container-low border border-surface-container mb-6 w-full aspect-[3/4]" />
              <div className="text-center flex flex-col items-center gap-2">
                <div className="h-6 bg-surface-container w-3/4 rounded" />
                <div className="h-4 bg-surface-container w-1/2 rounded" />
                <div className="h-5 bg-surface-container w-1/3 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
