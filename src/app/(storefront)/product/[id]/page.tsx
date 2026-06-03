import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, description, product_images(image_url)")
    .eq("id", resolvedParams.id)
    .single();

  if (!product) {
    return {
      title: "Product Not Found | Lumiere",
    };
  }

  return {
    title: `${product.name} | Lumiere`,
    description: product.description?.substring(0, 160) || `Buy ${product.name} at Lumiere.`,
    openGraph: {
      title: `${product.name} | Lumiere`,
      description: product.description?.substring(0, 160) || `Buy ${product.name} at Lumiere.`,
      images: [
        {
          url: product.product_images?.[0]?.image_url || "/assets/images/logo.png",
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

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
  const formattedProduct: any = {
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
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  };

  // Fetch Reviews
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", resolvedParams.id)
    .order("rating", { ascending: false })
    .order("created_at", { ascending: false });

  if (reviewsData && reviewsData.length > 0) {
    const userIds = Array.from(new Set(reviewsData.map(r => r.user_id).filter(Boolean)));
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", userIds);

    const profilesMap = (profilesData || []).reduce((acc: any, p: any) => {
      acc[p.id] = p;
      return acc;
    }, {});

    formattedProduct.reviews = reviewsData.map((r: any) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      user_id: r.user_id,
      user_name: profilesMap[r.user_id] 
        ? `${profilesMap[r.user_id].first_name || ""} ${profilesMap[r.user_id].last_name || ""}`.trim() || "Customer"
        : "Customer",
    }));

    const totalRating = formattedProduct.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    formattedProduct.averageRating = totalRating / formattedProduct.reviews.length;
    formattedProduct.totalReviews = formattedProduct.reviews.length;
  }

  const formattedRelated = (relatedProducts || []).map((p: any) => ({
    id: p.id,
    title: p.name,
    price: `$${p.price.toLocaleString()}`,
    imageUrl: p.product_images?.[0]?.image_url || "/assets/images/logo.png",
    isWishlisted: userWishlist.includes(p.id),
  }));

  return <ProductDetailClient product={formattedProduct} relatedProducts={formattedRelated} />;
}
