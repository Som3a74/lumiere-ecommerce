import { UserForm } from "@/components/admin/user-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const supabaseAdmin = createAdminClient();
  
  // Fetch from auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(id);
  
  if (authError || !authData.user) {
    notFound();
  }

  // Fetch from profiles to get role
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const user = {
    id: authData.user.id,
    email: authData.user.email || "",
    first_name: profile?.first_name || authData.user.user_metadata?.first_name || "",
    last_name: profile?.last_name || authData.user.user_metadata?.last_name || "",
    role: profile?.role || "customer",
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/users"
          className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant hover:text-on-surface"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Edit User</h1>
          <p className="mt-2 text-on-surface-variant">Update user details or change role.</p>
        </div>
      </div>

      <UserForm user={user} />
    </div>
  );
}
