export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          alt="Cinematic luxury hero image" 
          className="w-full h-full object-cover object-center opacity-80" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBMS5i7RivmPQy3lAGMGCe_cP-DYS7qoxcfYCRp5f8f-vEDxzZFW9bqeDOzTwWiD36LL4XqZvqqH3zL0JPBlvhdA6nrckmZ47HRa71PD708oR16Jnl-J3XiiiKTIst9N9rV1-J7AGXuBQWdfT_8si7k2D9zbEurNj7efbid2M_tjAB3HHUdr-2JR-tKc3KVEJZT_RrPxw0zQXxDemcOZGSOS9SKwrVxwQa-SW20tPhI4jCEvUStZTXz95vm8zfe0p4cy_aFxvVdPY7"
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
