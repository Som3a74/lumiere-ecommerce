import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

export function AboutHeritage() {
  return (
    <section className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-gutter items-center bg-background">
      <Reveal>
        <span className="font-label-caps text-label-caps text-gold-accent mb-6 block tracking-widest">EST. 1894 • GENÈVE</span>
        <h2 className="font-headline-lg text-display-lg-mobile md:text-display-lg text-primary mb-8 leading-tight">A Legacy of Light</h2>
        <div className="space-y-6 text-primary font-body-lg leading-relaxed">
          <p>Founded in the heart of Geneva in 1894, LUMIÈRE was born from a singular vision: to explore the essence of time with unwavering passion and understanding of heart. Our master artisans, ensuring that every sweeping hand and polished bevel meets an impossible standard.</p>
          <p>We do not simply manufacture, we sculpt legacy. Each creation is a testament to the philosophy of quiet luxury—where true value is felt in the weight of the gold, the smoothness of the winding crown, and the silent perfection of movement.</p>
        </div>
        <button className="mt-12 bg-primary text-white font-label-caps text-label-caps px-10 py-5 uppercase tracking-[0.2em] hover:bg-gold-accent transition-all duration-500 group relative overflow-hidden">
          <span className="relative z-10">Discover Our Heritage</span>
        </button>
      </Reveal>
      <Reveal delay={300} className="relative aspect-[4/5] overflow-hidden">
        <Image
          src="/assets/images/about/A Legacy of Light.webp"
          alt="A sophisticated black and white photograph of a historic Swiss atelier."
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </Reveal>
    </section>
  );
}
