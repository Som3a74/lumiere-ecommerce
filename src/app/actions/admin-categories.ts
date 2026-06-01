"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCategory(formData: FormData, categoryId?: string) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  
  if (!name || !slug) {
    throw new Error("Name and slug are required");
  }

  const payload = { name, slug };
  let newId = categoryId;

  if (categoryId) {
    const { error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', categoryId);
    
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from('categories')
      .insert(payload)
      .select('id')
      .single();
      
    if (error) throw new Error(error.message);
    newId = data.id;
  }

  revalidatePath('/admin/categories');
  return newId;
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  
  // Note: Depending on your schema, deleting a category might fail if products are linked to it.
  // We can either set products to null or prevent deletion. Let's try to delete.
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
    
  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
}
