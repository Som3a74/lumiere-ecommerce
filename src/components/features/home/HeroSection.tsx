import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-surface-container">
        <Image
          width={1920}
          height={1080}
          alt="Cinematic luxury hero image"
          className="w-full h-full object-cover object-center opacity-80"
          src="/assets/images/about/hero section.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
      </div>
      <div className="relative z-10 text-center px-margin-mobile flex flex-col items-center fade-in-section is-visible">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-surface-bright mb-6 max-w-3xl leading-tight">
          TIMELESS ELEGANCE,<br />REFINED.
        </h1>
        <p className="font-body-lg text-body-lg text-surface-bright/80 mb-10 max-w-xl mx-auto font-light">
          Discover the pinnacle of Swiss craftsmanship and modern design.
        </p>
        <a className="luxury-button px-8 py-4 border border-tertiary-fixed-dim text-surface-bright uppercase font-label-caps text-label-caps tracking-widest hover:bg-tertiary-fixed-dim/10 transition-colors duration-300" href="#collections">
          Shop the Collection
        </a>
      </div>
    </section>
  )
}
