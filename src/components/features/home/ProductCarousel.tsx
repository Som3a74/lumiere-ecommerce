import { createClient } from "@/utils/supabase/server";
import { ProductCarouselUI } from "./ProductCarouselUI";

interface ProductCarouselProps {
  type: "best-sellers" | "newly-added";
  title: string;
}

export async function ProductCarousel({ type, title }: ProductCarouselProps) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      categories (name),
      created_at,
      product_images (
        image_url
      )
    `)
    .is('deleted_at', null)
    .limit(8);

  if (type === "newly-added") {
    query = query.order("created_at", { ascending: false });
  } else if (type === "best-sellers") {
    // We will order by sales_count. If the column doesn't exist yet, this might fail,
    // so ensure the column is created. As a fallback, we could use price for now or created_at.
    // Assuming sales_count is created as per the plan.
    query = query.order("sales_count", { ascending: false });
  }

  const { data: productsData, error } = await query;

  if (error) {
    console.error("Error fetching carousel products:", error);
  }

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

  const carouselProducts = (productsData || []).map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: `$${product.price?.toLocaleString()}`,
    category: (Array.isArray(product.categories) ? product.categories[0] : product.categories)?.name || "Uncategorized",
    image: product.product_images?.[0]?.image_url || "/assets/images/logo.webp",
    isWishlisted: userWishlist.includes(product.id),
  }));

  return <ProductCarouselUI title={title} products={carouselProducts} />;
}
