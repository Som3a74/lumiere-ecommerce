"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/shared/ProductCard";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { addToCart } from "@/app/actions/cart";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ReviewsSection } from "./ReviewsSection";
import { VirtualTryOnButton } from "@/features/products/components/VirtualTryOnButton";

export default function ProductDetailPage({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const colorsList = product.colors?.length > 0 ? product.colors : ["Platinum"];
  const sizesList = product.sizes?.length > 0 ? product.sizes : ["40mm"];
  const featuresList = product.features?.length > 0 ? product.features : [];

  // Group images by color
  const imagesByColor = colorsList.reduce((acc: Record<string, string[]>, color: string) => {
    // Find images that match this color, or default to all images if none specified
    const colorImages = product.images.filter((img: any) => (img.color || "Platinum") === color).map((img: any) => img.image_url);
    acc[color] = colorImages.length > 0 ? colorImages : product.images.map((img: any) => img.image_url);
    if (acc[color].length === 0) acc[color] = ["/placeholder-image.jpg"];
    return acc;
  }, {} as Record<string, string[]>);

  const [selectedColor, setSelectedColor] = useState<string>(colorsList[0]);
  const [selectedImage, setSelectedImage] = useState<string>(imagesByColor[colorsList[0]]?.[0] || "/placeholder-image.jpg");
  const [selectedSize, setSelectedSize] = useState<string>(sizesList[0]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedImage(imagesByColor[color]?.[0] || "/placeholder-image.jpg");
  };

  // Normalize variants so that variants with null color/size match the fallbacks
  const normalizedVariants = (product.variants || []).map((v: any) => ({
    ...v,
    color: v.color || "Platinum",
    size: v.size || "40mm",
  }));

  const isSizeOutOfStockForColor = (sizeName: string, colorName: string) => {
    if (normalizedVariants.length === 0) return true;
    const variant = normalizedVariants.find((v: any) => v.color === colorName && v.size === sizeName);
    if (!variant) return true;
    return (variant.stock || 0) <= 0;
  };

  const currentVariant = normalizedVariants.find((v: any) => v.color === selectedColor && v.size === selectedSize) 
                         || normalizedVariants.find((v: any) => v.color === selectedColor);

  const displayPrice = currentVariant?.price ? `$${currentVariant.price.toLocaleString()}` : product.price;
  const comparePrice = currentVariant?.compare_at_price ? `$${currentVariant.compare_at_price.toLocaleString()}` : null;

  const getInlineColor = (colorName: string) => {
    const lower = colorName.toLowerCase();
    if (lower.includes("gold") && lower.includes("rose")) return "#FDE68A"; // amber-200
    if (lower.includes("gold")) return "#FDE047"; // yellow-300
    if (lower.includes("carbon") || lower.includes("black")) return "#1E293B"; // slate-800
    if (lower.includes("platinum") || lower.includes("silver")) return "#E4E4E7"; // zinc-200
    return lower; // standard CSS colors like "yellow", "green", or hex codes
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  const handleAddToCart = () => {
    startTransition(async () => {
      const variantId = currentVariant?.id || undefined;

      const result = await addToCart(product.id, { variantId });
      if (result?.error) {
        if (result.error.includes("logged in")) {
          toast.error("You must be logged in to add items to your cart.");
          router.push("/auth/login");
        } else {
          toast.error(result.error);
        }
      } else {
        toast.success("Added to cart successfully!");
        router.push("/cart");
      }
    });
  };

  const isCurrentVariantOutOfStock = () => {
    if (normalizedVariants.length === 0) return true;
    if (!currentVariant) return true;
    return (currentVariant.stock || 0) <= 0;
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
            {(imagesByColor[selectedColor] || []).map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-24 md:w-24 md:h-32 shrink-0 border relative overflow-hidden group ${selectedImage === img ? "border-primary" : "border-transparent hover:border-surface-dim transition-colors"}`}
              >
                <Image
                  fill
                  sizes="96px"
                  alt={`Thumbnail ${i + 1}`}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
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
            <Image
              alt={product.title}
              width={800}
              height={1000}
              className="w-full h-auto object-cover zoom-image"
              style={{ transformOrigin }}
              src={selectedImage}
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
            <p className="font-body-md text-body-md text-secondary mt-2">
              {product.description}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <p className="font-body-lg text-body-lg text-primary">{displayPrice}</p>
              {comparePrice && (
                <p className="font-body-md text-secondary line-through">{comparePrice}</p>
              )}
            </div>
          </div>

          {/* Variations */}
          <div className="mb-8">
            <p className="font-label-caps text-label-caps text-primary mb-4 uppercase">
              Material: <span className="text-secondary font-normal ml-2">{selectedColor}</span>
            </p>
            <div className="flex gap-4">
              {colorsList.map((c: string, idx: number) => {
                return (
                  <button
                    key={idx}
                    onClick={() => handleColorSelect(c)}
                    aria-label={`Select ${c}`}
                    className={`w-10 h-10 rounded-full border-2 relative overflow-hidden shadow-sm ${
                      selectedColor === c 
                        ? "border-primary" 
                        : "border-transparent hover:border-surface-dim transition-colors"
                    }`}
                    style={{ backgroundColor: getInlineColor(c) }}
                  >
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <p className="font-label-caps text-label-caps text-primary mb-4 uppercase">
              Size: <span className="text-secondary font-normal ml-2">{selectedSize}</span>
            </p>
            <div className="flex flex-wrap gap-4">
              {sizesList.map((s: string, idx: number) => {
                const outOfStock = isSizeOutOfStockForColor(s, selectedColor);
                return (
                  <button
                    key={idx}
                    onClick={() => !outOfStock && setSelectedSize(s)}
                    disabled={outOfStock}
                    className={`px-4 py-2 border relative overflow-hidden font-label-caps text-label-caps uppercase ${
                      outOfStock 
                        ? "border-surface-container text-secondary opacity-50 cursor-not-allowed bg-surface-dim" 
                        : selectedSize === s 
                          ? "border-primary bg-primary text-on-primary" 
                          : "border-surface-container text-primary hover:border-surface-dim transition-colors"
                    }`}
                  >
                    <span className={outOfStock ? "opacity-40" : ""}>{s}</span>
                    {outOfStock && (
                      <>
                        <span className="absolute w-[120%] h-[1px] bg-on-surface/40 -rotate-[20deg] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></span>
                        <span className="absolute w-[120%] h-[1px] bg-on-surface/40 rotate-[20deg] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Info */}
          <div className="mb-6 flex items-center">
            {isCurrentVariantOutOfStock() ? (
              <p className="font-body-md text-error flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error"></span> Out of stock
              </p>
            ) : (
              <p className="font-body-md text-secondary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" style={{ backgroundColor: '#22c55e' }}></span> 
                {currentVariant?.stock ? `Only ${currentVariant.stock} left in stock` : "In stock"}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-12">
            <Button
              variant="default"
              size="lg"
              onClick={handleAddToCart}
              disabled={isPending || isCurrentVariantOutOfStock()}
              className="w-full rounded-none uppercase text-on-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isPending ? "Adding to Cart..." : (isCurrentVariantOutOfStock() ? "Out of Stock" : "Add to Cart")}
              </span>
            </Button>
            <VirtualTryOnButton productImage={selectedImage} />
            <WishlistButton
              productId={product.id}
              initialIsWishlisted={product.isWishlisted}
              withText={true}
            />
          </div>

          {/* Accordions */}
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full border-t border-b border-surface-container">
            <AccordionItem value="item-1" className="border-b border-surface-container last:border-b-0">
              <AccordionTrigger className="font-label-caps text-label-caps text-primary uppercase py-6 hover:no-underline">
                Product Description
              </AccordionTrigger>
              <AccordionContent className="pb-6 font-body-md text-body-md text-secondary leading-relaxed">
                Engineered in Geneva, the Chronographe Éternel features a hand-wound mechanical movement visible through a sapphire crystal case back. The dial is enameled using traditional Grand Feu techniques, ensuring a brilliance that will not fade over time. The case measures a subtle 38mm, ideal for understated elegance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-surface-container last:border-b-0">
              <AccordionTrigger className="font-label-caps text-label-caps text-primary uppercase py-6 hover:no-underline">
                Features & Materials
              </AccordionTrigger>
              <AccordionContent className="pb-6 font-body-md text-body-md text-secondary leading-relaxed">
                {featuresList.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-2 mb-4">
                    {featuresList.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  <>
                    Case: 950 Platinum.<br />
                    Strap: Hand-stitched Louisiana Alligator.<br />
                    Crystal: Anti-reflective Sapphire.<br /><br />
                  </>
                )}
                To maintain the brilliance of your timepiece, avoid extreme temperature changes and magnetic fields. We recommend a full servicing every 5 years by an authorized LUMIÈRE horologist.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-surface-container last:border-b-0">
              <AccordionTrigger className="font-label-caps text-label-caps text-primary uppercase py-6 hover:no-underline">
                Shipping &amp; Returns
              </AccordionTrigger>
              <AccordionContent className="pb-6 font-body-md text-body-md text-secondary leading-relaxed">
                Complimentary secure global delivery via specialized courier within 3-5 business days. All shipments are fully insured. Returns are accepted within 14 days of receipt, provided the timepiece remains unworn and in its original packaging with all protective seals intact.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-margin-mobile md:px-margin-desktop">
        <ReviewsSection 
          productId={product.id}
          reviews={product.reviews || []}
          averageRating={product.averageRating || 0}
          totalReviews={product.totalReviews || 0}
        />
      </section>

      {/* You May Also Like */}
      <section className="px-margin-mobile md:px-margin-desktop">
        <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-12">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {relatedProducts.map((p, i) => (
            <ProductCard
              key={p.id}
              productId={p.id}
              title={p.title}
              price={p.price}
              imageUrl={p.imageUrl}
              href={`/product/${p.id}`}
              isWishlisted={p.isWishlisted}
              className={i === 2 ? "hidden md:block" : "block"}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
