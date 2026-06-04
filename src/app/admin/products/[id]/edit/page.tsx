import { createClient } from "@/utils/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const [productRes, categoriesRes, imagesRes, variantsRes, colorsRes, sizesRes] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('product_images').select('*').eq('product_id', id).order('display_order'),
    supabase.from('product_variants').select('*').eq('product_id', id).order('created_at'),
    supabase.from('colors').select('*').order('name'),
    supabase.from('sizes').select('*').order('name')
  ]);

  if (productRes.error || !productRes.data) {
    notFound();
  }

  const product = productRes.data;
  const categories = categoriesRes.data || [];
  const rawImages = imagesRes.data || [];
  const rawVariants = variantsRes.data || [];
  const colors = colorsRes.data || [];
  const sizes = sizesRes.data || [];

  // Group images by color_id
  const imagesByColorId: Record<string, string[]> = {};
  const nullColorImages: string[] = [];

  rawImages.forEach(img => {
    if (img.color_id) {
      if (!imagesByColorId[img.color_id]) imagesByColorId[img.color_id] = [];
      imagesByColorId[img.color_id].push(img.image_url);
    } else {
      nullColorImages.push(img.image_url);
    }
  });

  // Group variants by color_id to reconstruct colorGroups
  const groupedVariants = new Map<string, any>();
  let hasAssignedNullColorImages = false;

  rawVariants.forEach(variant => {
    const cid = variant.color_id || "none";
    if (!groupedVariants.has(cid)) {
      let images: string[] = [];
      if (variant.color_id && imagesByColorId[variant.color_id]) {
        images = [...imagesByColorId[variant.color_id]];
        delete imagesByColorId[variant.color_id];
      } else if (!variant.color_id && !hasAssignedNullColorImages && nullColorImages.length > 0) {
        images = [...nullColorImages];
        hasAssignedNullColorImages = true;
      }
      
      groupedVariants.set(cid, {
        color_id: variant.color_id || "none",
        sizes: [],
        images: images
      });
    }
    
    // Add size to the color group or capture base data
    if (variant.size_id) {
      groupedVariants.get(cid).sizes.push({
        id: variant.id,
        size_id: variant.size_id,
        stock: variant.stock || 0,
        sku: variant.sku || "",
        price: variant.price || null
      });
    } else {
      // This is the base variant for this color group (no sizes)
      const group = groupedVariants.get(cid);
      group.base_stock = variant.stock || 0;
      group.base_sku = variant.sku || "";
      group.base_price = variant.price || null;
    }
  });

  const colorGroups = Array.from(groupedVariants.values());

  const productWithVariants = {
    ...product,
    colorGroups
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Edit Product</h1>
          <p className="mt-2 text-on-surface-variant">{product.name}</p>
        </div>
      </div>

      <ProductForm 
        product={productWithVariants} 
        categories={categories} 
        colors={colors} 
        sizes={sizes} 
      />
    </div>
  );
}
