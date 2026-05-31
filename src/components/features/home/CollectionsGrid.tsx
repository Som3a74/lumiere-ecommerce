import Link from "next/link"

export function CollectionsGrid() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="collections">
      <div className="text-center mb-16 fade-in-section">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Maison Collections</h2>
        <div className="w-12 h-px bg-tertiary-fixed-dim mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Large Image Left */}
        <div className="md:col-span-7 relative group overflow-hidden fade-in-section">
          <div className="aspect-[4/5] bg-surface-container w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              alt="Luxury Timepiece" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1Z9ODRMhN0lG8DZb1UAqip6g81q5HV5A_FvnOSnBEtGPkpVbEfXqvY7SbTbDDvbrbiwz9ql3SJ8slCz-RsQU8Q5LTN61DjLqT0-RBEb-6LzPJ_9Jn4xqY0d01cZt5_F2HSbGaz3dUg3ds-kG2JccQXk0npIXeOwp40qAj5qpNixgQAgJEfpVy2BSNRVgt_aPCly3tfSY97Pgya9FkF7m91_qYnQpSU3q1pKRgHdQIAmy2UJKZuNyBd-GzeRlTUZfodblejmZJcVY4" 
            />
          </div>
          <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20"></div>
          <div className="absolute bottom-8 left-8 text-surface-bright">
            <h3 className="font-headline-md text-headline-md mb-2">Timepieces</h3>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest border-b border-surface-bright pb-1 hover:border-tertiary-fixed-dim hover:text-tertiary-fixed-dim transition-colors" href="/collections">Explore</Link>
          </div>
        </div>
        
        {/* Smaller Images Right */}
        <div className="md:col-span-5 flex flex-col gap-gutter">
          <div className="relative group overflow-hidden flex-1 fade-in-section" style={{ transitionDelay: "100ms" }}>
            <div className="bg-surface-container w-full h-full min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                alt="Leather Goods" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcpLPZZUUGLoo-YfrX2PIqEsofv440XnvqtJBpMY6w1-mwoAyzGZha-d9P734Cg1RMo-4JN9UV0P0seK0jPxRhdSGt2vQ5yWv3Axr0h4Ocsdp52svnBgyq1MaRGE9JWDsis1NYsF9AqzHPwpOgQ1Ok_P_rBvJVHqZmrQWTx_juz7_swFKg90yZ8hzt9e-dTaJwfQaYPR4gcsdjis_EZF44Ssy2bEjBYRNjebQ0TS76Jj0PFOVgp9ST_Ajv-g_6C2CpkUZyDMVCosq8" 
              />
            </div>
            <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20"></div>
            <div className="absolute bottom-6 left-6 text-surface-bright">
              <h3 className="font-headline-md text-headline-md mb-2">Leather Goods</h3>
              <Link className="font-label-caps text-label-caps uppercase tracking-widest border-b border-surface-bright pb-1 hover:border-tertiary-fixed-dim hover:text-tertiary-fixed-dim transition-colors" href="#">Explore</Link>
            </div>
          </div>
          
          <div className="bg-surface-bright p-8 border border-surface-container flex flex-col justify-center items-center text-center fade-in-section" style={{ transitionDelay: "200ms" }}>
            <span className="material-symbols-outlined text-4xl text-tertiary-fixed-dim mb-4" style={{ fontVariationSettings: "'wght' 200" }}>diamond</span>
            <h3 className="font-headline-md text-headline-md text-primary mb-3">Bespoke Services</h3>
            <p className="font-body-md text-body-md text-secondary mb-6">Commission a piece uniquely tailored to your uncompromising standards.</p>
            <a className="luxury-button font-label-caps text-label-caps text-primary uppercase tracking-widest py-2" href="#">Inquire Now</a>
          </div>
        </div>
      </div>
    </section>
  )
}
