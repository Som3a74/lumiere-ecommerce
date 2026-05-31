import Link from "next/link";
import { ProductCard } from "@/components/shared/ProductCard";
import { createClient } from "@/lib/server";

export default async function CollectionsPage() {
  const supabase = await createClient();
  
  // Fetch products and their images
  const { data: productsData, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      category,
      product_images (
        image_url
      )
    `);

  if (error) {
    console.error("Error fetching products:", error);
  }

  // Format the data to match what the ProductCard expects
  const collectionsProducts = (productsData || []).map((product) => ({
    title: product.name,
    price: `$${product.price.toLocaleString()}`,
    category: product.category,
    imageUrl: product.product_images?.[0]?.image_url || "/assets/images/logo.png",
    href: `/product/${product.id}`,
  }));

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      {/* Header & Filtering Area */}
      <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-2xl">
          <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-primary mb-4">
            Timepieces
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Discover our collection of meticulously crafted horological masterpieces, where tradition meets contemporary elegance.
          </p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-6 border-b border-surface-container pb-4">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest hidden md:block">
            Filter:
          </span>
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            <button className="font-body-md text-body-md text-primary flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-colors">
              Collection <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="font-body-md text-body-md text-primary flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-colors">
              Material <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="font-body-md text-body-md text-primary flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-colors">
              Complication <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="font-body-md text-body-md text-primary flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-colors">
              Price <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
          <div className="ml-auto pl-6 border-l border-surface-container">
            <button className="font-body-md text-body-md text-primary flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-colors">
              Sort by <span className="material-symbols-outlined text-sm">sort</span>
            </button>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {collectionsProducts.map((product, index) => (
          <ProductCard key={index} {...product} className={index % 4 === 1 || index % 4 === 3 ? "md:mt-12 lg:mt-0" : ""} />
        ))}
      </div>

      {/* Load More Action */}
      <div className="mt-24 text-center">
        <button className="inline-flex items-center justify-center px-12 py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-tint transition-colors duration-300">
          Load More
        </button>
      </div>
    </div>
  );
}
