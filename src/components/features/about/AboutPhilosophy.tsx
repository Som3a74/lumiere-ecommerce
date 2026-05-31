import { Reveal } from "@/components/ui/reveal";

export function AboutPhilosophy() {
  return (
    <section className="py-section-gap bg-surface-cream">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <Reveal className="text-center mb-24">
          <h2 className="font-headline-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">The LUMIÈRE Philosophy</h2>
          <p className="font-body-lg text-primary max-w-2xl mx-auto">Luxury is not a shout; it is a whisper that resonates through generations.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-gutter">
          <Reveal delay={100} className="text-center p-unit">
            <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center border border-outline-variant bg-background">
              <span className="material-symbols-outlined text-gold-accent" style={{ fontSize: "32px" }}>precision_manufacturing</span>
            </div>
            <h3 className="font-headline-md text-headline-lg mb-6 text-primary">Precision</h3>
            <p className="text-primary font-body-lg leading-relaxed">Microscopic tolerances and hand-finished movements that defy the standard of mass production.</p>
          </Reveal>
          <Reveal delay={200} className="text-center p-unit">
            <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center border border-outline-variant bg-background">
              <span className="material-symbols-outlined text-gold-accent" style={{ fontSize: "32px" }}>history_edu</span>
            </div>
            <h3 className="font-headline-md text-headline-lg mb-6 text-primary">Heritage</h3>
            <p className="text-primary font-body-lg leading-relaxed">Centuries of Genevan secrets passed down through generations of the same artisan families.</p>
          </Reveal>
          <Reveal delay={300} className="text-center p-unit">
            <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center border border-outline-variant bg-background">
              <span className="material-symbols-outlined text-gold-accent" style={{ fontSize: "32px" }}>auto_awesome</span>
            </div>
            <h3 className="font-headline-md text-headline-lg mb-6 text-primary">Soul</h3>
            <p className="text-primary font-body-lg leading-relaxed">Each piece is imbued with the spirit of the maker, ensuring no two LUMIÈRE creations are identical.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
