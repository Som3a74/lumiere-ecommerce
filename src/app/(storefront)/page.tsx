import { HeroSection } from "@/components/features/home/HeroSection"
import { CollectionsGrid } from "@/components/features/home/CollectionsGrid"
import { ProductCarousel } from "@/components/features/home/ProductCarousel"
import { BrandHeritage } from "@/components/features/home/BrandHeritage"
import { FadeObserver } from "@/components/shared/FadeObserver"
import { Suspense } from "react"
import { ProductCarouselSkeleton } from "@/components/features/home/ProductCarouselSkeleton"

export default function Home() {
  return (
    <>
      <FadeObserver />
      <HeroSection />
      <CollectionsGrid />
      <Suspense fallback={<ProductCarouselSkeleton title="Best Sellers" />}>
        <ProductCarousel type="best-sellers" title="Best Sellers" />
      </Suspense>
      <Suspense fallback={<ProductCarouselSkeleton title="Newly Added" />}>
        <ProductCarousel type="newly-added" title="Newly Added" />
      </Suspense>
      <BrandHeritage />
    </>
  );
}
