"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

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

  // Send email if status is shipped or delivered
  if (status === 'shipped' || status === 'delivered') {
    const { data: fullOrder } = await getAdminOrderDetails(orderId);
    
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      
      // Fallback to SMTP_EMAIL if customer email is not found, just to avoid failing
      const customerEmail = fullOrder?.contact_info?.email;
      const customerName = fullOrder?.contact_info?.firstName || 'Customer';
      const orderIdShort = orderId.split('-')[0].toUpperCase();
      
      if (customerEmail) {
        let statusMessage = "";
        let statusSubject = "";
        if (status === 'shipped') {
          statusSubject = `Your Lumiere Order #${orderIdShort} has Shipped`;
          statusMessage = "Great news! Your order has been carefully packaged and handed over to our shipping partner. It's now on its way to you.";
        } else {
          statusSubject = `Your Lumiere Order #${orderIdShort} has been Delivered`;
          statusMessage = "Your order has arrived! We hope you enjoy your new piece. Thank you for choosing Lumiere.";
        }

        await transporter.sendMail({
          from: `"Lumiere" <${process.env.SMTP_EMAIL}>`,
          to: customerEmail,
          subject: statusSubject,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 1px solid #eeeeee;">
              <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid #eeeeee;">
                <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere-ecommerce-mocha.vercel.app'}/assets/images/logo.png" alt="LUMIERE" style="height: 35px; width: auto; object-fit: contain;" />
              </div>
              <div style="padding: 30px 0; color: #333333; line-height: 1.6; font-size: 14px;">
                <h1 style="font-size: 18px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; color: #111111; text-align: center;">Order Update</h1>
                <p>Dear ${customerName},</p>
                <p>${statusMessage}</p>
                
                <div style="text-align: center; margin-top: 40px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere-ecommerce-mocha.vercel.app'}/my-account/orders/${orderId}" style="display: inline-block; background-color: #111111; color: #ffffff; text-decoration: none; padding: 14px 28px; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">
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
      }
    } catch (emailError) {
      console.error("Failed to send order status email:", emailError);
    }
  }

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${orderId}`);
  
  return { success: true, message: `Order status updated to ${status}` };
}
