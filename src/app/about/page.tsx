import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)]">
      {/* 
        Minimalist 2-Section About Page 
        Emphasizing Quiet Luxury and Brand Identity
      */}

      {/* Section 1: Hero & Philosophy */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop py-24 max-w-4xl mx-auto space-y-12">
        <h1 className="font-display-lg-mobile md:font-display-lg text-[40px] md:text-[64px] tracking-[0.15em] text-primary">
          LUMIÈRE GENÈVE
        </h1>
        <div className="w-12 h-[1px] bg-primary mx-auto" />
        <p className="font-body-lg text-body-lg text-secondary leading-relaxed">
          Founded in the heart of Geneva, Lumière represents the pinnacle of modern craftsmanship. 
          We believe that true luxury does not scream; it whispers. It is found in the weight of the materials, 
          the precision of the cut, and the invisible hours of dedication woven into every piece.
        </p>
        <p className="font-body-lg text-body-lg text-secondary leading-relaxed">
          Our collections are designed for those who appreciate subtle details and uncompromising quality. 
          From the initial sketch to the final polish, every step is guided by a profound respect for 
          traditional techniques and an eye toward contemporary, timeless design.
        </p>
      </section>

      {/* Section 2: Minimalist Call to Action */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-surface-container flex flex-col items-center justify-center text-center space-y-8">
        <span className="material-symbols-outlined text-[48px] text-primary font-light">
          diamond
        </span>
        <h2 className="font-headline-md text-headline-md text-primary tracking-widest uppercase">
          Discover The Collection
        </h2>
        <Link 
          href="/collections" 
          className="inline-block bg-primary text-on-primary px-12 py-4 font-label-caps text-label-caps uppercase tracking-[0.2em] hover:bg-tertiary-fixed-dim hover:text-primary transition-colors duration-300"
        >
          View Masterpieces
        </Link>
      </section>
    </div>
  );
}
