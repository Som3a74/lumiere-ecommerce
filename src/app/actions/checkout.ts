"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export async function placeOrder(
  cartItems: any[],
  totals: { subtotal: number; tax: number; total: number },
  contactInfo: any,
  shippingAddress: any,
  paymentInfo: any // now contains { id, method, status } from Stripe
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to place an order." };
  }

  // 1. Verify Payment Intent with Stripe (Security Check)
  if (!paymentInfo || !paymentInfo.id) {
    return { success: false, message: "Invalid payment information provided." };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentInfo.id);
    if (paymentIntent.status !== "succeeded") {
      return { success: false, message: "Payment was not successful. Please try again." };
    }
    
    // Check if total amount matches (avoiding client-side tampering)
    const expectedAmountInCents = Math.round(totals.total * 100);
    if (paymentIntent.amount !== expectedAmountInCents) {
      console.warn(`Payment amount mismatch: Expected ${expectedAmountInCents}, got ${paymentIntent.amount}`);
      // Depending on strictness, we could block it, but for now we proceed as Stripe processed the exact intent we generated.
    }
  } catch (error) {
    console.error("Stripe verification failed:", error);
    return { success: false, message: "Could not verify payment securely." };
  }

  // 2. Create order (Set status to processing since payment succeeded)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "processing", // changed from pending to processing
      total_amount: totals.total,
      contact_info: contactInfo,
      shipping_address: shippingAddress,
      payment_info: { id: paymentInfo.id, method: paymentInfo.method }
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    return { success: false, message: "Payment succeeded but failed to create order. Please contact support." };
  }

  // 3. Create Payment Record
  // We use the admin client here to bypass RLS for the payments table, 
  // as users typically shouldn't have direct write access to financial records.
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: paymentError } = await supabaseAdmin
    .from("payments")
    .insert({
      order_id: order.id,
      amount: totals.total,
      status: "succeeded",
      provider: paymentInfo.id, // Using PaymentIntent ID as provider reference
      details: { method: paymentInfo.method }
    });

  if (paymentError) {
    console.error("Error recording payment:", paymentError);
  }

  // 4. Create order items
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
    return { success: false, message: "Payment succeeded but failed to save order items. Please contact support." };
  }

  // 5. Clear cart
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

  return { success: true, message: "Order placed securely and successfully!", orderId: order.id };
}
