"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const getSupabaseAdmin = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

export async function getAdminOrders() {
  const supabase = getSupabaseAdmin();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      status,
      total_amount,
      contact_info,
      created_at,
      payments (
        status,
        provider,
        details
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin orders:", error);
    return { success: false, data: [] };
  }

  return { success: true, data: orders || [] };
}

export async function getAdminOrderDetails(orderId: string) {
  const supabase = getSupabaseAdmin();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      status,
      total_amount,
      contact_info,
      shipping_address,
      created_at,
      order_items (
        id,
        quantity,
        price_at_time,
        product:products (
          name,
          product_images (
            image_url
          )
        ),
        variant:product_variants (
          color:colors ( name ),
          size:sizes ( name )
        )
      ),
      payments (
        status,
        provider,
        details,
        amount
      )
    `)
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order details:", error);
    return { success: false, data: null, error: error.message };
  }

  return { success: true, data: order };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: error.message };
  }

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${orderId}`);
  
  return { success: true, message: `Order status updated to ${status}` };
}
