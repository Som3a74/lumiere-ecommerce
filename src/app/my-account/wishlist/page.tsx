import Link from "next/link";

export default function WishlistPage() {
  const wishlistItems = [
    {
      title: "L'Éclipse Noire",
      price: "$12,500.00",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMVCkQdrMQKEtYKoVEQY1NcOCRLxp_lP8k-TdcTs0xfubdKOGRFCChJDKzKeMzMicT2JbSsRekCnviLzgvz4FC7krn27v6I0XQOI2CY5x51BRDQfuDlc5XX93dnxWwre-Ntu48-xT1rryXllCOocmHWEkDrAWsFPrztKjL4EyuaIyu8-fBObEUImsLG0UdzFPSr-5rAS0NTYNSeZ_SCiBtT70lgSWnlPQoisa97iSDRBPFQNg3j87h5A5T0Y0CuiMfRlBUEhxybvcJ",
    },
    {
      title: "Héritage 1924",
      price: "$15,200.00",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT4-tnzcom2uEA_Fel996Z7xUHkHGuzw7jINgsH4e7yLK3dmz2Rd3QNwvcCG-ohKB2hMmLhZkXkvIcqgS4UJ-hGAzbadzzp8glxBCJt48gjOhWZaG-GdBoehWPnm1aOcnsuV5iN7i16OkCYMKzHyyj7uL-PXzgwDaFK8Ma98ZFbTfuB6PBG4_s_mwZD-G-t4atTYeYnve3Q2NKLZzqDO1K1_3ep5Ypm9T-js_ArRCwaSYDWEef6NdRxTDk-Ne8_8dCMty-P8H7GejA",
    },
    {
      title: "Sac de Nuit",
      price: "$3,800.00",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtwzKWoNQXq3jedMqQ5lvE0lUCipf-SzjWkAogLwqWNtUWgsTjhGcCcvr7tBiDtWE4wsetKUf5mrplXJEFowVp26UHKTU0W1fcH-gIPpzq_FtaNHTsc4fKz5_CwC8AjF8iQlCaE7OHgZo8Zkg9rslIpy9UUJ52q7i0pVfqnjA44cnQMDysk3JlzYTmP3y-4_iS-Qp2N8zj-4PpXq9PkKfXTq4e3FM-IOH0N8DIxpINtUrrQ47ULJdFjFH5k91EKyU0F0qpabfxGX_n",
    },
    {
      title: "Aura Classique",
      price: "$8,900.00",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtvkWmW82FxFtu1EF8IS8lrrfbSO-_L3czoQS4u3cQ8NU2es9js6jgDC2dvjNxtOGp3_AGlH3l_lYLHtqsGcs145i05kphyCud-xwKD0Km2xjgOA6Y3ibpCWKPRxWeGNDWVnR6ECFXizfgyQfLl2zgYjoNRxleW0tFiKIKpbKYYWWQ95RQ_anPv8w4faxkNY0YRESzJDgRaGpdE0r1zpXbQ_NLOGCGITv1euTaSX5NDuI_QuVZTsCPjRob8Si3ryS1NDh3xC5UiZVq",
    }
  ];

  return (
    <section>
      <div className="flex justify-between items-end border-b border-surface-container pb-4 mb-8">
        <h2 className="font-headline-md text-headline-md text-primary">Your Wishlist</h2>
        <span className="font-body-md text-secondary">{wishlistItems.length} Items</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {wishlistItems.map((item, index) => (
          <div key={index} className="group cursor-pointer flex flex-col">
            <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-6">
              <Link href="/product-detail">
                <img
                  alt={item.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  src={item.imageUrl}
                />
              </Link>
              <button className="absolute top-4 right-4 text-primary bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors z-10 flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </button>
            </div>
            <div className="text-center flex-grow flex flex-col justify-end">
              <Link href="/product-detail">
                <h3 className="font-headline-md text-[20px] text-primary mb-2 hover:underline underline-offset-4 line-clamp-1">{item.title}</h3>
              </Link>
              <p className="font-body-md text-secondary mb-4">{item.price}</p>
              <button className="w-full mt-auto border border-primary text-primary py-3 font-label-caps text-label-caps tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
