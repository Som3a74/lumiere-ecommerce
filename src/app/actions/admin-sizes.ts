"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSize(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  const payload = {
    name,
  };

  let error;
  if (id) {
    const { error: updateError } = await supabase
      .from("sizes")
      .update(payload)
      .eq("id", id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("sizes")
      .insert([payload]);
    error = insertError;
  }

  if (error) {
    console.error("Error saving size:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/sizes");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteSize(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sizes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting size:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/sizes");
  revalidatePath("/admin/products");
  return { success: true };
}
