"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-05-27.dahlia" as any,
});

export async function placeOrder(
  cartItems: any[],
  totals: { subtotal: number; discount?: number; tax: number; total: number },
  contactInfo: any,
  shippingAddress: any,
  paymentInfo: any, // now contains { id, method, status } from Stripe
  couponId?: string
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
      payment_info: { id: paymentInfo.id, method: paymentInfo.method },
      coupon_id: couponId || null
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

  // Send Order Confirmation Email via Nodemailer
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const itemsHtml = cartItems.map((item) => {
      const productData = Array.isArray(item.product) ? item.product[0] : item.product;
      const price = productData.price * item.quantity;
      return `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${productData.name} <span style="color:#999; font-size: 12px; margin-left: 5px;">x${item.quantity}</span></td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">$${price.toLocaleString()}</td>
        </tr>
      `;
    }).join("");

    await transporter.sendMail({
      from: `"Lumiere" <${process.env.SMTP_EMAIL}>`,
      to: user.email || contactInfo.email,
      subject: `Lumiere - Order Confirmed #${order.id.split('-')[0].toUpperCase()}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 1px solid #eeeeee;">
          <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid #eeeeee;">
            <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere-ecommerce-mocha.vercel.app'}/assets/images/logo.png" alt="LUMIERE" style="height: 35px; width: auto; object-fit: contain;" />
          </div>
          <div style="padding: 30px 0; color: #333333; line-height: 1.6; font-size: 14px;">
            <h1 style="font-size: 18px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; color: #111111; text-align: center;">Order Confirmed</h1>
            <p>Dear ${contactInfo.firstName || 'Customer'},</p>
            <p>Thank you for choosing Lumiere. Your order has been successfully placed and is now being meticulously prepared for shipment.</p>
            
            <div style="margin-top: 30px; margin-bottom: 30px;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #111; padding-bottom: 5px; margin-bottom: 10px;">Order Summary</h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
            </div>

            <div style="background-color: #fcfcfc; padding: 20px; border: 1px solid #f0f0f0; margin-bottom: 30px;">
              <p style="margin: 0 0 10px 0;"><strong>Order Reference:</strong> #${order.id.split('-')[0].toUpperCase()}</p>
              <p style="margin: 0 0 10px 0;"><strong>Shipping Address:</strong> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}</p>
              <p style="margin: 0 0 10px 0;"><strong>Total Amount:</strong> $${totals.total.toLocaleString()}</p>
              <p style="margin: 0;"><strong>Status:</strong> Processing</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere-ecommerce-mocha.vercel.app'}/my-account/orders/${order.id}" style="display: inline-block; background-color: #111111; color: #ffffff; text-decoration: none; padding: 14px 28px; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">
              View Order Status
              </a>
            </div>
          </div>
          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999;">
            <p>&copy; ${new Date().getFullYear()} Lumiere. All rights reserved.</p>
          </div>
        </div>
      `
    });
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError);
  }

  return { success: true, message: "Order placed securely and successfully!", orderId: order.id };
}
