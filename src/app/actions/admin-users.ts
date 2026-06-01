"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveUser(formData: FormData) {
  const supabaseAdmin = createAdminClient();
  
  const id = formData.get("id") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const role = formData.get("role") as string;

  if (!email || !firstName || !lastName || !role) {
    throw new Error("Missing required fields");
  }

  let error;
  let userId = id;

  if (id) {
    // Update existing user
    const updatePayload: any = {
      email,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    };
    if (password) {
      updatePayload.password = password;
    }
    
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(id, updatePayload);
    error = updateError;
  } else {
    // Create new user
    if (!password) {
      throw new Error("Password is required for new users");
    }
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });
    error = createError;
    userId = userData?.user?.id || "";
  }

  if (error) {
    console.error("Error saving user in Auth:", error);
    throw new Error(error.message);
  }

  // Ensure the role is updated in the profiles table (which was auto-created by the trigger)
  if (userId) {
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ role, first_name: firstName, last_name: lastName })
      .eq("id", userId);
      
    if (profileError) {
      console.error("Error updating profile role:", profileError);
      throw new Error("User created but failed to assign role: " + profileError.message);
    }
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    console.error("Error deleting user:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/users");
  return { success: true };
}
