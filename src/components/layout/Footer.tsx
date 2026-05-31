import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-primary-container w-full border-t border-surface-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
        {/* Column 1: Brand */}
        <div className="flex flex-col gap-6">
          <span className="font-display-lg text-headline-lg text-primary dark:text-surface-bright tracking-tighter">LUMIÈRE</span>
          <p className="font-body-md text-body-md text-secondary dark:text-on-secondary-container max-w-xs">
            Purveyors of quiet luxury and uncompromising Swiss craftsmanship since 1894.
          </p>
        </div>
        
        {/* Column 2: Links */}
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary dark:text-surface-bright font-semibold mb-2">Explore</span>
          <Link className="font-body-md text-body-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-surface-bright transition-colors duration-200 underline-offset-4 hover:underline" href="#">Maison</Link>
          <Link className="font-body-md text-body-md text-primary dark:text-surface-bright font-semibold hover:text-primary dark:hover:text-surface-bright transition-colors duration-200 underline-offset-4 hover:underline" href="/collections">Collections</Link>
          <Link className="font-body-md text-body-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-surface-bright transition-colors duration-200 underline-offset-4 hover:underline" href="#">Bespoke</Link>
        </div>
        
        {/* Column 3: Client Services */}
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary dark:text-surface-bright font-semibold mb-2">Support</span>
          <Link className="font-body-md text-body-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-surface-bright transition-colors duration-200 underline-offset-4 hover:underline" href="#">Client Services</Link>
          <Link className="font-body-md text-body-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-surface-bright transition-colors duration-200 underline-offset-4 hover:underline" href="#">Shipping & Returns</Link>
          <Link className="font-body-md text-body-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-surface-bright transition-colors duration-200 underline-offset-4 hover:underline" href="#">Care Guide</Link>
        </div>
        
        {/* Column 4: Newsletter */}
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary dark:text-surface-bright font-semibold mb-2">Newsletter</span>
          <p className="font-body-md text-body-md text-secondary dark:text-on-secondary-container mb-2">Subscribe to receive exclusive communications.</p>
          <div className="relative w-full">
            <input className="w-full bg-transparent border-0 border-b border-surface-dim focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-body-md text-primary placeholder:text-secondary-fixed-dim transition-colors" placeholder="Email Address" type="email" />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:text-tertiary-fixed-dim transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Copyright Bottom Bar */}
      <div className="px-margin-mobile md:px-margin-desktop py-8 border-t border-surface-container max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary dark:text-on-secondary-container">© 2024 LUMIÈRE GENÈVE. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-6">
          <Link className="font-label-caps text-[10px] uppercase tracking-widest text-secondary dark:text-on-secondary-container hover:text-primary transition-colors" href="#">Legal</Link>
          <Link className="font-label-caps text-[10px] uppercase tracking-widest text-secondary dark:text-on-secondary-container hover:text-primary transition-colors" href="#">Sustainability</Link>
        </div>
      </div>
    </footer>
  )
}
