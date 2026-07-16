import { StorefrontHeader } from "@/components/layout/StorefrontHeader";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";

function HeaderFallback() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-primary/90 border-b border-surface-container backdrop-blur-md">
      <div className="flex justify-between lg:grid lg:grid-cols-3 items-center w-full px-margin-mobile md:px-margin-desktop h-24 max-w-container-max mx-auto">
        <div className="hidden lg:flex" />
        <div className="flex justify-start lg:justify-center items-center">
          <span className="font-display-lg-mobile md:font-display-lg text-[28px] md:text-[36px] tracking-[0.15em] text-primary dark:text-surface-bright whitespace-nowrap">
            LUMIÈRE
          </span>
        </div>
        <div className="flex justify-end" />
      </div>
    </header>
  );
}

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <StorefrontHeader />
      </Suspense>
      <main className="flex-1 mt-24">{children}</main>
      <Footer />
    </>
  );
}
