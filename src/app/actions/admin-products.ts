"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveProduct(formData: FormData, existingProductId?: string) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category_id = formData.get("category_id") as string;
  const explicitId = formData.get("id") as string;
  
  // Parse features (comma separated for simplicity in UI)
  const featuresRaw = formData.get("features") as string;
  const features = featuresRaw ? featuresRaw.split(",").map(f => f.trim()).filter(Boolean) : [];

  const colorGroupsRaw = formData.get("colorGroups") as string;
  const colorGroups = colorGroupsRaw ? JSON.parse(colorGroupsRaw) : [];

  if (!name || !price || !category_id) {
    throw new Error("Missing required fields");
  }

  const payload: Record<string, unknown> = {
    name,
    description,
    price,
    category_id,
    features,
  };

  let newProductId = existingProductId || explicitId;

  if (existingProductId) {
    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', existingProductId);
    
    if (error) throw new Error(error.message);
  } else {
    // It's a new product, use explicitId if provided
    if (explicitId) {
      payload.id = explicitId;
    }
    const { data, error } = await supabase
      .from('products')
      .upsert(payload)
      .select('id')
      .single();
      
    if (error) throw new Error(error.message);
    newProductId = data.id;
  }

  // Handle colorGroups (which contain variants and images)
  if (colorGroups) {
    // Flatten colorGroups into a single array of variants
    const flatVariants: Record<string, unknown>[] = [];
    for (const group of colorGroups) {
      if (group.sizes && group.sizes.length > 0) {
        for (const size of group.sizes) {
          flatVariants.push({
            id: size.id,
            color_id: group.color_id,
            size_id: size.size_id,
            stock: size.stock,
            sku: size.sku,
            price: size.price
          });
        }
      } else {
        // If they created a color group but no sizes, create one variant with null size
        // Generate an ID for it using crypto.randomUUID()
        const fallbackId = crypto.randomUUID();
        flatVariants.push({
          id: fallbackId,
          color_id: group.color_id,
          size_id: null,
          stock: group.base_stock || 0,
          sku: group.base_sku || "",
          price: group.base_price || null
        });
      }
    }

    // 1. Fetch existing variants to know what to delete
    const { data: existingVariants } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', newProductId);
      
    const existingIds = existingVariants?.map(v => v.id) || [];
    const incomingIds = flatVariants.map(v => v.id);
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));

    // 2. Delete removed variants
    for (const id of idsToDelete) {
      try {
        await supabase.from('product_variants').delete().eq('id', id);
      } catch (e) {
        console.error("Failed to delete variant due to FK constraints", e);
      }
    }

    // 3. Upsert variants
    for (const variant of flatVariants) {
      const variantId = variant.id;
      
      let sku = (variant.sku as string) || "";
      if (typeof sku === 'string' && sku.startsWith("[AUTO]")) {
        sku = sku.replace("[AUTO]", `PROD-${newProductId.substring(0,4).toUpperCase()}`);
      } else if (!sku) {
        sku = `PROD-${newProductId.substring(0,4).toUpperCase()}-${variant.color_id || 'BASE'}-${variant.size_id || 'BASE'}`;
      }
      
      const { error: varError } = await supabase
        .from('product_variants')
        .upsert({
          id: variantId,
          product_id: newProductId,
          color_id: variant.color_id || null,
          size_id: variant.size_id || null,
          stock: variant.stock || 0,
          sku: sku,
          price: variant.price || null,
        });
        
      if (varError) throw new Error(varError.message);
    }

    // 4. Handle Images (Clear and Re-insert)
    await supabase.from('product_images').delete().eq('product_id', newProductId);

    const uniqueImages = new Set<string>();
    const imagesToInsert: Record<string, unknown>[] = [];
    
    for (const group of colorGroups) {
      if (group.images && group.images.length > 0) {
        for (let i = 0; i < group.images.length; i++) {
          const imgUrl = group.images[i];
          if (!uniqueImages.has(imgUrl)) {
            uniqueImages.add(imgUrl);
            imagesToInsert.push({
              product_id: newProductId,
              image_url: imgUrl,
              color_id: group.color_id || null,
              display_order: imagesToInsert.length,
              is_thumbnail: imagesToInsert.length === 0,
            });
          }
        }
      }
    }

    if (imagesToInsert.length > 0) {
      const { error: imgError } = await supabase
        .from('product_images')
        .insert(imagesToInsert);
      if (imgError) throw new Error(imgError.message);
    }
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
  const color_id = (formData.get("color_id") as string) || null;
  const size_id = (formData.get("size_id") as string) || null;
  const stock = parseInt(formData.get("stock") as string);
  const sku = formData.get("sku") as string;
  const priceRaw = formData.get("price");
  const price = priceRaw ? parseFloat(priceRaw as string) : null;
  
  if (!product_id || isNaN(stock) || !sku) {
    return { error: "Missing required variant fields" };
  }

  const { error } = await supabase
    .from('product_variants')
    .insert({
      product_id,
      color_id,
      size_id,
      stock,
      sku,
      price
    });
    
  if (error) return { error: error.message };

  revalidatePath(`/admin/products/${product_id}/edit`);
}

export async function deleteVariant(variantId: string, productId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', variantId);
    
  if (error) return { error: error.message };

  revalidatePath(`/admin/products/${productId}/edit`);
}

