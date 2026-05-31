import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      category,
      colors,
      sizes,
      features,
      product_images (
        image_url,
        is_thumbnail,
        display_order,
        color
      )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (productError || !product) {
    return notFound();
  }

  // Fetch 3 related products
  const { data: relatedProducts, error: relatedError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      product_images (
        image_url
      )
    `)
    .neq("id", resolvedParams.id)
    .limit(3);

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

  // Format data for the client component
  const formattedProduct = {
    id: product.id,
    title: product.name,
    price: `$${product.price.toLocaleString()}`,
    description: product.description,
    images: (product.product_images || []), // Keeping objects to extract color later
    colors: product.colors || [],
    sizes: product.sizes || [],
    features: product.features || [],
    isWishlisted: userWishlist.includes(product.id),
  };

  const formattedRelated = (relatedProducts || []).map((p: any) => ({
    id: p.id,
    title: p.name,
    price: `$${p.price.toLocaleString()}`,
    imageUrl: p.product_images?.[0]?.image_url || "/assets/images/logo.png",
    isWishlisted: userWishlist.includes(p.id),
  }));

  return <ProductDetailClient product={formattedProduct} relatedProducts={formattedRelated} />;
}
