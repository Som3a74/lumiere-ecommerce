"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addReview(productId: string, rating: number, comment: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to leave a review." };
  }

  if (rating < 1 || rating > 5) {
    return { success: false, message: "Rating must be between 1 and 5." };
  }

  // Optional: Check if user already reviewed this product to prevent spam
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingReview) {
    return { success: false, message: "You have already reviewed this product." };
  }

  const { error } = await supabase
    .from("reviews")
    .insert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment: comment.trim(),
    });

  if (error) {
    console.error("Error adding review:", error);
    return { success: false, message: `Failed to submit review: ${error.message}` };
  }

  revalidatePath(`/product/${productId}`);
  return { success: true, message: "Review submitted successfully!" };
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    return { success: false, message: "Unauthorized." };
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    console.error("Error deleting review:", error);
    return { success: false, message: "Failed to delete review." };
  }

  revalidatePath("/admin/reviews");
  return { success: true, message: "Review deleted successfully." };
}
