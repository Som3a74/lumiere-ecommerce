import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  title: string;
  price: string;
  category?: string;
  imageUrl: string;
  imageAlt?: string;
  href: string;
  className?: string;
}

export function ProductCard({
  title,
  price,
  category,
  imageUrl,
  imageAlt,
  href,
  className,
}: ProductCardProps) {
  return (
    <article className={cn("group cursor-pointer", className)}>
      <div className="relative bg-surface-container-low mb-6 overflow-hidden aspect-[3/4]">
        <Link href={href} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={imageAlt || title}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
            src={imageUrl}
          />
        </Link>
        <button className="absolute top-4 right-4 p-2 text-primary/50 hover:text-primary transition-colors z-10 bg-white/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 duration-300">
          <span className="material-symbols-outlined">favorite</span>
        </button>
      </div>
      <div className="text-center">
        {category && (
          <p className="font-label-caps text-label-caps text-secondary mb-2 uppercase tracking-widest">
            {category}
          </p>
        )}
        <Link href={href}>
          <h3 className="font-headline-md text-headline-md text-primary mb-2 hover:underline underline-offset-4">
            {title}
          </h3>
        </Link>
        <p className="font-body-md text-body-md text-secondary">{price}</p>
      </div>
    </article>
  );
}
