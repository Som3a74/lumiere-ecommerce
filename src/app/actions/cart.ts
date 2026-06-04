"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function addToCart(productId: string, options?: { variantId?: string }) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to add items to your cart" };
  }

  let variantStock: number | null = null;

  if (options?.variantId) {
    // 1. Verify variant exists and has stock
    const { data: variant, error: variantError } = await supabase
      .from("product_variants")
      .select("stock")
      .eq("id", options.variantId)
      .single();

    if (variantError || !variant) {
      return { error: "Selected product variant not found" };
    }

    if (variant.stock <= 0) {
      return { error: "This item is currently out of stock" };
    }
    variantStock = variant.stock;
  }

  // 2. Check if item is already in cart
  let existingQuery = supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (options?.variantId) {
    existingQuery = existingQuery.eq("variant_id", options.variantId);
  } else {
    existingQuery = existingQuery.is("variant_id", null);
  }

  const { data: existingCartItem } = await existingQuery.single();

  if (existingCartItem) {
    // Increment quantity, but check against stock limit if it's a variant-based product
    const newQuantity = existingCartItem.quantity + 1;
    if (variantStock !== null && newQuantity > variantStock) {
      return { error: `Cannot add more. Only ${variantStock} items available in stock.` };
    }

    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", existingCartItem.id);

    if (updateError) {
      return { error: "Failed to update cart quantity" };
    }
  } else {
    // Add new item
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert([
        {
          user_id: user.id,
          product_id: productId,
          quantity: 1,
          variant_id: options?.variantId || null,
        }
      ]);

    if (insertError) {
      console.error("Insert error in addToCart:", insertError);
      return { error: `Failed to add item to cart: ${insertError.message}` };
    }
  }

  revalidatePath("/cart");
  revalidatePath("/product/[id]");
  
  return { success: true };
}

export async function removeCartItem(itemId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to remove item" };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  if (quantity < 1) {
    return removeCartItem(itemId);
  }

  // Fetch the cart item to find its variant_id and check stock
  const { data: cartItem, error: cartError } = await supabase
    .from("cart_items")
    .select("variant_id")
    .eq("id", itemId)
    .eq("user_id", user.id)
    .single();

  if (cartError || !cartItem) {
    return { error: "Cart item not found" };
  }

  if (cartItem.variant_id) {
    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock")
      .eq("id", cartItem.variant_id)
      .single();

    if (variant && quantity > variant.stock) {
      return { error: `Cannot update quantity. Only ${variant.stock} items available.` };
    }
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to update quantity" };
  }

  revalidatePath("/cart");
  return { success: true };
}
