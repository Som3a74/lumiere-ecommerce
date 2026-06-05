import Link from "next/link";
import { ProductCard } from "@/components/shared/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { FiltersClient } from "./FiltersClient";
import { Metadata } from "next";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : null;
  
  const title = category ? `${category} Collection` : "Our Collection";
  const description = category 
    ? `Explore our exclusive ${category} collection. Crafted with precision and elegance.`
    : "Discover our collection of meticulously crafted pieces, where tradition meets contemporary elegance.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | LUMIÈRE GENÈVE`,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere-ecommerce.vercel.app'}/collections${category ? `?category=${category}` : ''}`,
    }
  };
}

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : null;
  const material = typeof resolvedParams.material === 'string' ? resolvedParams.material : null;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'newest';
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : null;
  const price = typeof resolvedParams.price === 'string' ? resolvedParams.price : null;

  // Build the query
  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      categories!inner(name),
      created_at,
      product_images (
        image_url
      )
    `)
    .is("deleted_at", null);

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    const catLower = category.toLowerCase();
    if (catLower === 'watches' || catLower === 'timepieces') {
      query = query.in('categories.name', ['Watches', 'Timepieces', 'Chronograph', 'Automatic', 'Tourbillon', 'Heritage']);
    } else if (catLower === 'bags' || catLower === 'leather goods') {
      query = query.in('categories.name', ['Bags', 'Leather Goods', 'Tote']);
    } else {
      query = query.ilike('categories.name', category);
    }
  }

  if (material) {
    query = query.ilike('description', `%${material}%`);
  }

  if (price) {
    if (price === 'under_1000') {
      query = query.lt('price', 1000);
    } else if (price === '1000_5000') {
      query = query.gte('price', 1000).lte('price', 5000);
    } else if (price === 'over_5000') {
      query = query.gt('price', 5000);
    }
  }

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    // newest
    query = query.order('created_at', { ascending: false });
  }

  // Fetch products
  const { data: productsData, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
  }

  // Fetch categories for filter
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("name")
    .order("name", { ascending: true });
    
  const dynamicCategories = (categoriesData || []).map(cat => ({
    label: cat.name,
    value: cat.name
  }));

  // Fetch wishlist status
  const { data: { user } } = await supabase.auth.getUser();
  let userWishlist: string[] = [];
  if (user) {
    const { data: wishlistData } = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("user_id", user.id);

    if (wishlistData) {
      userWishlist = wishlistData.map(item => item.product_id);
    }
  }

  // Format the data to match what the ProductCard expects
  const collectionsProducts = (productsData || []).map((product) => ({
    productId: product.id,
    title: product.name,
    price: `$${product.price.toLocaleString()}`,
    category: (Array.isArray(product.categories) ? product.categories[0] : product.categories)?.name || "Uncategorized",
    imageUrl: product.product_images?.[0]?.image_url || "/assets/images/logo.webp",
    href: `/product/${product.id}`,
    isWishlisted: userWishlist.includes(product.id),
  }));

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      {/* Header & Filtering Area */}
      <header className="mb-16 flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8">
        <div className="max-w-2xl">
          <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-primary mb-4">
            {category ? category : "Our Collection"}
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Discover our collection of meticulously crafted pieces, where tradition meets contemporary elegance.
          </p>
        </div>

        <FiltersClient dynamicCategories={dynamicCategories} />
      </header>

      {/* Product Grid */}
      {collectionsProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {collectionsProducts.map((product, index) => (
            <ProductCard
              key={product.productId}
              {...product}
              className={index % 4 === 1 || index % 4 === 3 ? "md:mt-12 lg:mt-0" : ""}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface-container-low border border-surface-container">
          <span className="material-symbols-outlined text-[48px] text-secondary mb-4">search_off</span>
          <h3 className="font-headline-md text-primary mb-2">No products found</h3>
          <p className="font-body-md text-secondary">We couldn't find any products matching your current filters.</p>
        </div>
      )}

      {/* Load More Action */}
      {collectionsProducts.length > 0 && (
        <div className="mt-24 text-center">
          <button className="inline-flex items-center justify-center px-12 py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-tint transition-colors duration-300">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
