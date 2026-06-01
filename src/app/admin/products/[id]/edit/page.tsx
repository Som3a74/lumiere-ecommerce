import { createClient } from "@/utils/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ImageManager } from "@/components/admin/image-manager";
import { VariantManager } from "@/components/admin/variant-manager";

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
  const images = imagesRes.data || [];
  const variants = variantsRes.data || [];
  const colors = colorsRes.data || [];
  const sizes = sizesRes.data || [];

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

      <ProductForm product={product} categories={categories} />

      <hr className="border-outline-variant/30" />
      
      <VariantManager productId={product.id} variants={variants} colors={colors} sizes={sizes} />

      <hr className="border-outline-variant/30" />

      <ImageManager productId={product.id} images={images} colors={colors} />

    </div>
  );
}
