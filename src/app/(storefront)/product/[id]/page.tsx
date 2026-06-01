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
      categories (
        name
      ),
      product_variants (
        id,
        color_id,
        size_id,
        stock,
        price,
        compare_at_price,
        color:colors(name),
        size:sizes(name)
      ),
      features,
      product_images (
        image_url,
        is_thumbnail,
        display_order,
        color_id,
        color:colors(name)
      )
    `)
    .eq("id", resolvedParams.id)
    .is("deleted_at", null)
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
    .is("deleted_at", null)
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
    images: (product.product_images || []).map((img: any) => ({
      ...img,
      color: img.color?.name || null
    })),
    colors: Array.from(new Set((product.product_variants || []).map((v: any) => v.color?.name).filter(Boolean))),
    sizes: Array.from(new Set((product.product_variants || []).map((v: any) => v.size?.name).filter(Boolean))),
    variants: (product.product_variants || []).map((v: any) => ({
      ...v,
      color: v.color?.name || null,
      size: v.size?.name || null,
    })),
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
