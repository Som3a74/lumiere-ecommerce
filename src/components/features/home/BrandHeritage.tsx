import Image from "next/image";

export function BrandHeritage() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
        <div className="order-2 md:order-1 pr-0 md:pr-16 fade-in-section">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">A Legacy of Light</h2>
          <p className="font-body-lg text-body-lg text-secondary mb-6 leading-relaxed">
            Founded in the heart of Geneva in 1894, LUMIÈRE was born from a singular vision: to capture the essence of time with unwavering precision and understated grace. Our master artisans dedicate hundreds of hours to a single timepiece, ensuring that every sweeping hand and polished bevel meets an impossible standard.
          </p>
          <p className="font-body-md text-body-md text-secondary mb-10 leading-relaxed">
            We do not simply manufacture; we sculpt legacy. Each creation is a testament to the philosophy of quiet luxury—where true value is felt in the weight of the materials, the smoothness of the winding crown, and the silent perfection of the movement.
          </p>
          <a className="luxury-button font-label-caps text-label-caps text-primary uppercase tracking-widest py-2" href="#">Discover Our Heritage</a>
        </div>
        <div className="order-1 md:order-2 h-[600px] bg-surface-container relative overflow-hidden fade-in-section group">
          <Image
            width={1920}
            height={1080}
            alt="Craftsmanship"
            className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            style={{ transformOrigin: "center center" }}
            src="/assets/images/home/A Legacy of Light.png"
          />
        </div>
      </div>
    </section>
  )
}
