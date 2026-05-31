"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/shared/ProductCard";

export default function ProductDetailPage({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [openAccordion, setOpenAccordion] = useState<number | null>(0); // First one open by default

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="max-w-container-max mx-auto pb-section-gap">
      <style jsx>{`
        .zoom-container {
          overflow: hidden;
          position: relative;
          cursor: crosshair;
        }
        .zoom-image {
          transition: transform 0.3s ease;
          transform-origin: center center;
        }
        .zoom-container:hover .zoom-image {
          transform: scale(1.5);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="px-margin-mobile md:px-margin-desktop py-8 text-secondary font-label-caps text-label-caps uppercase">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-primary transition-colors">Timepieces</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{product.title}</span>
      </div>

      {/* Product Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop mb-section-gap">
        {/* Left: Gallery */}
        <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-6 md:sticky md:top-28 items-start h-fit">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible w-full md:w-24 shrink-0 no-scrollbar">
            {product.images.map((img: string, i: number) => (
              <button key={i} className={`w-20 h-24 md:w-24 md:h-32 shrink-0 border relative overflow-hidden group ${i === 0 ? "border-primary" : "border-transparent hover:border-surface-dim transition-colors"}`}>
                <img
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={img}
                />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div
            className="w-full bg-surface-bright zoom-container"
            onMouseMove={handleMouseMove}
          >
            <img
              alt={product.title}
              className="w-full h-auto object-cover zoom-image"
              style={{ transformOrigin }}
              src={product.images[0] || "/assets/images/logo.png"}
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:col-span-5 md:pl-8 flex flex-col">
          <div className="mb-8">
            <p className="font-label-caps text-label-caps text-secondary mb-2 uppercase">
              Ref. 49201-B
            </p>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
              {product.title}
            </h1>
            <p className="font-body-lg text-body-lg text-secondary mb-6 leading-relaxed">
              {product.description}
            </p>
            <p className="font-body-lg text-body-lg text-primary">{product.price}</p>
          </div>

          {/* Variations */}
          <div className="mb-10">
            <p className="font-label-caps text-label-caps text-primary mb-4 uppercase">
              Material: <span className="text-secondary font-normal ml-2">Platinum &amp; Alligator</span>
            </p>
            <div className="flex gap-4">
              <button aria-label="Select Platinum" className="w-10 h-10 rounded-full border-2 border-primary bg-zinc-200"></button>
              <button aria-label="Select Rose Gold" className="w-10 h-10 rounded-full border border-surface-container bg-amber-200 hover:border-primary transition-colors"></button>
              <button aria-label="Select Carbon" className="w-10 h-10 rounded-full border border-surface-container bg-slate-800 hover:border-primary transition-colors"></button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-12">
            <Link href="/checkout" className="w-full text-center bg-primary text-on-primary font-label-caps text-label-caps uppercase py-5 border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 group relative overflow-hidden">
              <span className="relative z-10">Add to Cart</span>
            </Link>
            <button className="w-full bg-transparent text-primary font-label-caps text-label-caps uppercase py-5 border border-surface-container hover:border-primary transition-all duration-300 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">favorite_border</span>
              Add to Wishlist
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-surface-container border-b">
            {/* Accordion Item 1 */}
            <div className="border-b border-surface-container last:border-b-0">
              <button
                aria-expanded={openAccordion === 0}
                className="w-full flex justify-between items-center py-6 focus:outline-none"
                onClick={() => toggleAccordion(0)}
              >
                <span className="font-label-caps text-label-caps text-primary uppercase">Product Description</span>
                <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openAccordion === 0 ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openAccordion === 0 ? "500px" : "0px" }}
              >
                <div className="pb-6 font-body-md text-body-md text-secondary leading-relaxed">
                  Engineered in Geneva, the Chronographe Éternel features a hand-wound mechanical movement visible through a sapphire crystal case back. The dial is enameled using traditional Grand Feu techniques, ensuring a brilliance that will not fade over time. The case measures a subtle 38mm, ideal for understated elegance.
                </div>
              </div>
            </div>

            {/* Accordion Item 2 */}
            <div className="border-b border-surface-container last:border-b-0">
              <button
                aria-expanded={openAccordion === 1}
                className="w-full flex justify-between items-center py-6 focus:outline-none"
                onClick={() => toggleAccordion(1)}
              >
                <span className="font-label-caps text-label-caps text-primary uppercase">Materials &amp; Care</span>
                <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openAccordion === 1 ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openAccordion === 1 ? "500px" : "0px" }}
              >
                <div className="pb-6 font-body-md text-body-md text-secondary leading-relaxed">
                  Case: 950 Platinum.<br />
                  Strap: Hand-stitched Louisiana Alligator.<br />
                  Crystal: Anti-reflective Sapphire.<br /><br />
                  To maintain the brilliance of your timepiece, avoid extreme temperature changes and magnetic fields. We recommend a full servicing every 5 years by an authorized LUMIÈRE horologist.
                </div>
              </div>
            </div>

            {/* Accordion Item 3 */}
            <div className="border-b border-surface-container last:border-b-0">
              <button
                aria-expanded={openAccordion === 2}
                className="w-full flex justify-between items-center py-6 focus:outline-none"
                onClick={() => toggleAccordion(2)}
              >
                <span className="font-label-caps text-label-caps text-primary uppercase">Shipping &amp; Returns</span>
                <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openAccordion === 2 ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openAccordion === 2 ? "500px" : "0px" }}
              >
                <div className="pb-6 font-body-md text-body-md text-secondary leading-relaxed">
                  Complimentary secure global delivery via specialized courier within 3-5 business days. All shipments are fully insured. Returns are accepted within 14 days of receipt, provided the timepiece remains unworn and in its original packaging with all protective seals intact.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="px-margin-mobile md:px-margin-desktop">
        <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-12">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {relatedProducts.map((p, i) => (
            <ProductCard
              key={p.id}
              title={p.title}
              price={p.price}
              imageUrl={p.imageUrl}
              href={`/product/${p.id}`}
              className={i === 2 ? "hidden md:block" : "block"}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
