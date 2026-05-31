"use client"

import { useEffect } from "react"
import { HeroSection } from "@/components/features/home/HeroSection"
import { CollectionsGrid } from "@/components/features/home/CollectionsGrid"
import { ProductCarousel } from "@/components/features/home/ProductCarousel"
import { BrandHeritage } from "@/components/features/home/BrandHeritage"

export default function Home() {
  useEffect(() => {
    // Intersection Observer for Fade-in Animations (Copied from HTML)
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach((section) => {
      observer.observe(section);
    });
    
    // Trigger immediately for elements already in viewport
    setTimeout(() => {
      document.querySelectorAll('.fade-in-section').forEach(el => {
        const rect = el.getBoundingClientRect();
        if(rect.top < window.innerHeight) {
          el.classList.add('is-visible');
        }
      });
    }, 100);

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <HeroSection />
      <CollectionsGrid />
      <ProductCarousel />
      <BrandHeritage />
    </>
  );
}
