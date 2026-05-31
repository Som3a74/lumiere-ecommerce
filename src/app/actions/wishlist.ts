"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", redirect: "/auth/login" };
  }

  // Check if it already exists
  const { data: existingItem, error: fetchError } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 means no rows found, which is expected if not in wishlist
    return { error: fetchError.message };
  }

  if (existingItem) {
    // Remove from wishlist
    const { error: deleteError } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", existingItem.id);

    if (deleteError) {
      return { error: deleteError.message };
    }
  } else {
    // Add to wishlist
    const { error: insertError } = await supabase
      .from("wishlist_items")
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath("/", "layout");
  return { success: true, isWishlisted: !existingItem };
}
