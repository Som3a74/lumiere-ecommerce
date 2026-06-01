"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";

export async function login(data: LoginInput) {
  const { email, password } = data;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/my-account");
}

export async function signup(data: RegisterInput) {
  const { email, password, firstName, lastName } = data;

  if (!email || !password || !firstName || !lastName) {
    return { error: "All fields are required" };
  }

  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/my-account");
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/auth/login");
}
