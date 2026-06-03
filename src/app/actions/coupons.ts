"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function applyCoupon(code: string) {
  if (!code) {
    return { success: false, message: "Please enter a coupon code." };
  }

  const supabase = await createClient();

  // Find the coupon
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (error || !coupon) {
    return { success: false, message: "Invalid coupon code." };
  }

  if (!coupon.is_active) {
    return { success: false, message: "This coupon is no longer active." };
  }

  if (coupon.expiration_date && new Date(coupon.expiration_date) < new Date()) {
    return { success: false, message: "This coupon has expired." };
  }

  // Store coupon code in a cookie
  const cookieStore = await cookies();
  cookieStore.set("applied_coupon", coupon.code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return { success: true, message: `Coupon applied! ${coupon.discount_percentage}% off.` };
}

export async function removeCoupon() {
  const cookieStore = await cookies();
  cookieStore.delete("applied_coupon");
  
  revalidatePath("/cart");
  revalidatePath("/checkout");

  return { success: true, message: "Coupon removed." };
}

export async function getAppliedCoupon() {
  const cookieStore = await cookies();
  const appliedCoupon = cookieStore.get("applied_coupon")?.value;

  if (!appliedCoupon) return null;

  const supabase = await createClient();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", appliedCoupon)
    .single();

  if (error || !coupon || !coupon.is_active || (coupon.expiration_date && new Date(coupon.expiration_date) < new Date())) {
    // We cannot modify cookies during a Server Component render.
    // The invalid cookie will just be ignored here.
    return null;
  }

  return coupon;
}
