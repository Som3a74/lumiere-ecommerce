"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { sendOrderStatusUpdateEmail } from "@/lib/email";
import { createAdminClient } from "@/utils/supabase/admin";

export async function getAdminOrders() {
  const supabase = createAdminClient();

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
    return { success: false, data: [], error: error.message };
  }

  return { success: true, data: orders || [] };
}

export async function getAdminOrderDetails(orderId: string) {
  const supabase = createAdminClient();

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
  const supabase = createAdminClient();

  // Get current order details to find previous status
  const { data: currentOrder } = await getAdminOrderDetails(orderId);
  const oldStatus = currentOrder?.status || 'pending';
  
  const updatedContactInfo = {
    ...(currentOrder?.contact_info || {}),
    previous_status: oldStatus
  };

  const { error } = await supabase
    .from("orders")
    .update({ 
      status,
      contact_info: updatedContactInfo,
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: error.message };
  }

  // Send email for all status updates
  const { data: fullOrder } = await getAdminOrderDetails(orderId);
  
  let customerEmail = fullOrder?.contact_info?.email;
  const customerName = fullOrder?.contact_info?.firstName || 'Customer';
  
  if (!customerEmail && fullOrder?.user_id) {
    const { data: { user } } = await supabase.auth.admin.getUserById(fullOrder.user_id);
    if (user?.email) {
      customerEmail = user.email;
    }
  }
  
  console.log(`[DEBUG] Updating order ${orderId} to ${status}. customerEmail:`, customerEmail);
  
  if (customerEmail) {
    try {
      console.log(`[DEBUG] Attempting to send email to ${customerEmail}...`);
      await sendOrderStatusUpdateEmail(customerEmail, orderId, status, customerName);
      console.log(`[DEBUG] Email sent successfully.`);
    } catch (e) {
      console.error(`[DEBUG] Error sending email:`, e);
    }
  }

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/my-account`);
  revalidatePath(`/my-account/orders`);
  revalidatePath(`/my-account/orders/${orderId}`);
  
  return { success: true, message: `Order status updated to ${status}` };
}
