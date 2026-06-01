"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function placeOrder(
  cartItems: any[],
  totals: { subtotal: number; tax: number; total: number },
  contactInfo: any,
  shippingAddress: any,
  paymentInfo: any
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to place an order." };
  }

  // 1. Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total_amount: totals.total,
      contact_info: contactInfo,
      shipping_address: shippingAddress,
      payment_info: paymentInfo
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    return { success: false, message: "Failed to create order." };
  }

  // 2. Create order items
  const orderItemsData = cartItems.map((item) => {
    const productData = Array.isArray(item.product) ? item.product[0] : item.product;
    return {
      order_id: order.id,
      product_id: productData.id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      price_at_time: productData.price,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    return { success: false, message: "Failed to save order items." };
  }

  // 3. Clear cart
  const { error: clearCartError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (clearCartError) {
    console.error("Error clearing cart:", clearCartError);
    // Non-fatal error, order was placed
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/my-account");

  return { success: true, message: "Order placed successfully!", orderId: order.id };
}
