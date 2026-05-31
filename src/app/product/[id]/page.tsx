import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      category,
      product_images (
        image_url,
        is_thumbnail,
        display_order
      )
    `)
    .eq("id", params.id)
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
    .neq("id", params.id)
    .limit(3);

  // Format data for the client component
  const formattedProduct = {
    id: product.id,
    title: product.name,
    price: `$${product.price.toLocaleString()}`,
    description: product.description,
    images: (product.product_images || []).map((img: any) => img.image_url),
  };

  const formattedRelated = (relatedProducts || []).map((p: any) => ({
    id: p.id,
    title: p.name,
    price: `$${p.price.toLocaleString()}`,
    imageUrl: p.product_images?.[0]?.image_url || "/assets/images/logo.png",
  }));

  return <ProductDetailClient product={formattedProduct} relatedProducts={formattedRelated} />;
}
