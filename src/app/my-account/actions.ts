"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(formData: FormData) {
  const firstName = formData.get("fname") as string;
  const lastName = formData.get("lname") as string;
  const email = formData.get("email") as string; // Read-only but included
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to update your profile" };
  }

  const updateData: any = {
    data: {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      address: address,
    }
  };

  if (password) {
    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long." };
    }
    updateData.password = password;
  }

  // Update Auth Metadata (and password if provided)
  const { error: updateError } = await supabase.auth.updateUser(updateData);

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
