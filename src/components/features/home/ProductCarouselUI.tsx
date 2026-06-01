"use client";

import { useRef } from "react";
import { ProductCard } from "@/components/shared/ProductCard";

interface CarouselProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  category?: string;
  image: string;
  isWishlisted?: boolean;
}

interface ProductCarouselUIProps {
  title: string;
  products: CarouselProduct[];
}

export function ProductCarouselUI({ title, products }: ProductCarouselUIProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-section-gap bg-surface px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="max-w-container-max mx-auto fade-in-section">
        <div className="flex justify-between items-end mb-12 border-b border-surface-container pb-4">
          <h2 className="font-headline-lg text-headline-lg text-primary">{title}</h2>
          <div className="flex gap-4">
            <button 
              onClick={scrollLeft}
              className="p-2 border border-surface-container rounded hover:bg-surface-container transition-colors"
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 border border-surface-container rounded hover:bg-surface-container transition-colors"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <ProductCard
                productId={product.id}
                title={product.name}
                price={product.price}
                category={product.category || product.description}
                imageUrl={product.image}
                href={`/product/${product.id}`}
                isWishlisted={product.isWishlisted}
              />
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="w-full text-center py-12 text-secondary">
              No products found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
