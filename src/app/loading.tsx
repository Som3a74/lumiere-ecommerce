export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop">
      <div className="flex flex-col items-center gap-8 animate-pulse">
        <div className="w-12 h-12 border-2 border-surface-container-highest border-t-primary rounded-full animate-spin"></div>
        <p className="font-label-caps text-label-caps tracking-[0.2em] text-secondary uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
