"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(formData: FormData) {
  const firstName = formData.get("fname") as string;
  const lastName = formData.get("lname") as string;
  const email = formData.get("email") as string; // Read-only but included
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to update your profile" };
  }

  // Update Auth Metadata
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      address: address,
    }
  });

  if (updateError) {
    return { error: updateError.message };
  }

  // Attempt to update public.profiles if it exists
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("Failed to update profile table (might not exist):", profileError);
  }

  revalidatePath("/my-account");
  revalidatePath("/my-account/profile");
  
  return { success: true };
}
