export function ProductCarousel() {
  const products = [
    {
      id: "p1",
      name: "L'Éclipse",
      description: "Automatic, 40mm",
      price: "CHF 12,500",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqGBhCr98GBVK4--h6DCRyCn9bUInPtW_znIMWY7EAIn-jDdbX2fSMgkQ_18qtTXtEwSaQKFMWfFDcmSBb-WX3-gwoyEiWwzj27FmNolsrnHV-73JZJ1gMiNEq1IbI2CjHKJAQBVhoAuDVmZJZnJ3XspvEZ2JZpXaoSsDk-Dges04gcF8trCDp8RRGfTpnBpy9XnDseHIUMSszATu1tc0TVwK4PMZsS-jADpbotYGHNQbcDkRfw4TcD56o8PjuXyuJDahbM0Ul7cKm",
    },
    {
      id: "p2",
      name: "Chronographe Noir",
      description: "Manual, 42mm",
      price: "CHF 18,200",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKdFlB3BUZHrGc_2UiBATi6mB8cokJ3uZPGRT9nDBnEsC5k3HgXtzghk97Ms0akPYDqW75dKuyqoA1q6DBTi9J3yi7a5wPs3e61oyL0Wbo6NxSJyoLHDm_GsXWvhUiqs6llRgF8gGLKc99-7m1z6w8R_reehntv64IJEZWLbkb0Yr1KSNL2CqMwoKRbG-Hbhm6ImTLMDX_RpJ4cSof4zJ9V9iHnPUqNTvuuJBbsrJ0poTOSLHo6oS084rMYeY7ojvQCtsGSwRg54Eq",
    },
    {
      id: "p3",
      name: "Le Voyageur",
      description: "Full Grain Calfskin",
      price: "CHF 3,800",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWG-KX8xecRP7Nk0dG4nf0ftB736DHc1DkqODJ0nPE7dWrpvJHFICO4rJ4XI_CvGeIyIvhXyqWhHMcg2-3WGoxjD3cvo1NnCleeVb9Yb_VRdNKm42enyFqvQwK76i8KsF9gGZB8yr0B5zcsqWtBk2JlTb4qqWxJcfUDmXQfygxTF8bPk2kH-buLnip92e6fene1SyjocF6gyFwt6JsQInrsOgTvIjbigUhditLba553tMCirx7uDu_kaOSJ_1UbLI7GHuh0tAridb0",
    },
    {
      id: "p4",
      name: "Classique Or",
      description: "Automatic, 38mm",
      price: "CHF 22,000",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaeI_5732VUKiaa93Zu9Nc16SkzkYHiJO0iOBPfy7z-eNPllh4IAq-G-b7EbX7VhQ_mqhdugS_GozkUQEa_7zTprU1ncxpwD9tbSn-f0UGCEFiL6qREQsDx5GemblNyfz4xf3Tb51dGtRk9ZkgpTdMmbUCfIbbQuZmNllqKVE5e30-gSTL4LSAA0rnZbmh7GR2PYXZiHRzTyKfNBISPnVKQwO6nSu9Jclu2MagEbAayZCK3YdY54OK4e0E__wDPim2pB_rdUKJjZEy",
    }
  ]

  return (
    <section className="py-section-gap bg-surface px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="max-w-container-max mx-auto fade-in-section">
        <div className="flex justify-between items-end mb-12 border-b border-surface-container pb-4">
          <h2 className="font-headline-lg text-headline-lg text-primary">Curated Selections</h2>
          <div className="flex gap-4">
            <button className="p-2 border border-surface-container rounded hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="p-2 border border-surface-container rounded hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        
        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer">
              <div className="bg-surface-bright border border-surface-container mb-6 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt={product.name} 
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" 
                  src={product.image} 
                />
                <div className="absolute bottom-0 w-full p-4 bg-white/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Quick View</span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-headline-md text-headline-md text-primary mb-1">{product.name}</h4>
                <p className="font-body-md text-body-md text-secondary">{product.description}</p>
                <p className="font-body-md text-body-md text-primary mt-2">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
