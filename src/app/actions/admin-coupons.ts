"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCoupon(formData: FormData, couponId?: string) {
  const supabase = await createClient();
  
  const code = formData.get("code") as string;
  const discount_percentage = parseFloat(formData.get("discount_percentage") as string);
  const expiration_date = formData.get("expiration_date") as string;
  const is_active = formData.get("is_active") === "true";
  
  if (!code || isNaN(discount_percentage)) {
    throw new Error("Code and valid discount percentage are required");
  }

  const payload = { 
    code: code.toUpperCase(), 
    discount_percentage,
    expiration_date: expiration_date ? new Date(expiration_date).toISOString() : null,
    is_active
  };
  
  let newId = couponId;

  if (couponId) {
    const { error } = await supabase
      .from('coupons')
      .update(payload)
      .eq('id', couponId);
    
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from('coupons')
      .insert(payload)
      .select('id')
      .single();
      
    if (error) throw new Error(error.message);
    newId = data.id;
  }

  revalidatePath('/admin/coupons');
  return newId;
}

export async function deleteCoupon(couponId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', couponId);
    
  if (error) throw new Error(error.message);

  revalidatePath('/admin/coupons');
}
