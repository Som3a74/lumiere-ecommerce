"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function addToCart(productId: string, options?: { color?: string; size?: string }) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to add items to your cart" };
  }

  // Check if item is already in cart with same product, color, and size
  let existingQuery = supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (options?.color) existingQuery = existingQuery.eq("color", options.color);
  else existingQuery = existingQuery.is("color", null);
  
  if (options?.size) existingQuery = existingQuery.eq("size", options.size);
  else existingQuery = existingQuery.is("size", null);

  const { data: existingCartItem } = await existingQuery.single();

  if (existingCartItem) {
    // Increment quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existingCartItem.quantity + 1 })
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
          color: options?.color || null,
          size: options?.size || null,
        }
      ]);

    if (insertError) {
      return { error: "Failed to add item to cart" };
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
