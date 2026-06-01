"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveProduct(formData: FormData, productId?: string) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category_id = formData.get("category_id") as string;
  
  // Parse features (comma separated for simplicity in UI)
  const featuresRaw = formData.get("features") as string;
  const features = featuresRaw ? featuresRaw.split(",").map(f => f.trim()).filter(Boolean) : [];

  if (!name || !price || !category_id) {
    throw new Error("Missing required fields");
  }

  const payload = {
    name,
    description,
    price,
    category_id,
    features,
  };

  let newProductId = productId;

  if (productId) {
    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', productId);
    
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('id')
      .single();
      
    if (error) throw new Error(error.message);
    newProductId = data.id;
  }

  revalidatePath('/admin/products');
  return newProductId;
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  
  // Soft delete
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', productId);
    
  if (error) throw new Error(error.message);

  revalidatePath('/admin/products');
}

export async function addVariant(formData: FormData) {
  const supabase = await createClient();
  
  const product_id = formData.get("product_id") as string;
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;
  const stock = parseInt(formData.get("stock") as string);
  const sku = formData.get("sku") as string;
  const priceRaw = formData.get("price");
  const price = priceRaw ? parseFloat(priceRaw as string) : null;
  
  if (!product_id || !color || !size || isNaN(stock) || !sku) {
    throw new Error("Missing required variant fields");
  }

  const { error } = await supabase
    .from('product_variants')
    .insert({
      product_id,
      color,
      size,
      stock,
      sku,
      price
    });
    
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${product_id}/edit`);
}

export async function deleteVariant(variantId: string, productId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', variantId);
    
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${productId}/edit`);
}

