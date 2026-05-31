import { Reveal } from "@/components/ui/reveal";

export function AboutBespoke() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop text-center bg-background">
      <Reveal className="max-w-4xl mx-auto">
        <span className="font-label-caps text-label-caps text-secondary mb-8 block tracking-widest">EXCLUSIVE ACCESS</span>
        <h2 className="font-headline-lg text-display-lg-mobile md:text-display-lg text-primary mb-10 leading-tight">A Journey Tailored to You</h2>
        <p className="font-body-lg text-primary mb-16 leading-relaxed max-w-3xl mx-auto">Experience the pinnacle of luxury with our Bespoke Service. Whether a unique complication for your watch or a personalized leather creation, our masters await your vision.</p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button className="bg-primary text-background font-label-caps text-label-caps px-12 py-6 uppercase tracking-widest hover:bg-gold-accent transition-all duration-500">
            Book a Consultation
          </button>
          <button className="border border-primary text-primary font-label-caps text-label-caps px-12 py-6 uppercase tracking-widest hover:bg-surface-cream transition-all duration-500">
            Request a Catalog
          </button>
        </div>
      </Reveal>
    </section>
  );
}
