"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveColor(formData: FormData, colorId?: string) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const hex_code = formData.get("hex_code") as string;
  
  if (!name) {
    throw new Error("Name is required");
  }

  const payload = { name, hex_code: hex_code || null };
  let newId = colorId;

  if (colorId) {
    const { error } = await supabase
      .from('colors')
      .update(payload)
      .eq('id', colorId);
    
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from('colors')
      .insert(payload)
      .select('id')
      .single();
      
    if (error) throw new Error(error.message);
    newId = data.id;
  }

  revalidatePath('/admin/colors');
  return newId;
}

export async function deleteColor(colorId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('colors')
    .delete()
    .eq('id', colorId);
    
  if (error) throw new Error(error.message);

  revalidatePath('/admin/colors');
}
