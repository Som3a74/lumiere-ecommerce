import { HeroSection } from "@/components/features/home/HeroSection"
import { CollectionsGrid } from "@/components/features/home/CollectionsGrid"
import { ProductCarousel } from "@/components/features/home/ProductCarousel"
import { BrandHeritage } from "@/components/features/home/BrandHeritage"
import { FadeObserver } from "@/components/shared/FadeObserver"
import { Suspense } from "react"
import { ProductCarouselSkeleton } from "@/components/features/home/ProductCarouselSkeleton"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover our collection of meticulously crafted timepieces, where tradition meets contemporary elegance.",
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'LUMIÈRE GENÈVE',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere.com',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere.com'}/assets/images/logo.png`,
      },
      {
        '@type': 'WebSite',
        name: 'LUMIÈRE GENÈVE',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere.com',
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
