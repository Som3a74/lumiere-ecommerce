import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/admin";
import { Plus } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { UserActions } from "@/components/admin/user-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const supabaseAdmin = createAdminClient();
  
  // We fetch users from auth.users (which includes emails)
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
  
  // And we fetch profiles to get roles (just in case they differ or we need extra data)
  const { data: profiles } = await supabaseAdmin.from("profiles").select("*");
  
  const profilesMap = new Map((profiles || []).map(p => [p.id, p]));

  const users = (authData?.users || []).map(u => {
    const profile = profilesMap.get(u.id);
    return {
      id: u.id,
      email: u.email,
      first_name: profile?.first_name || u.user_metadata?.first_name,
      last_name: profile?.last_name || u.user_metadata?.last_name,
      role: profile?.role || 'customer',
      created_at: u.created_at,
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const columns: Column<any>[] = [
    {
      header: "Name",
      accessorKey: "first_name",
      cell: (item) => `${item.first_name || ""} ${item.last_name || ""}`.trim() || "Unknown",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item) => (
        <Badge variant={item.role === 'admin' ? 'default' : 'secondary'} className="uppercase text-[10px] tracking-widest px-2 py-0.5 rounded-sm">
          {item.role}
        </Badge>
      )
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (item) => new Date(item.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => <UserActions userId={item.id} />
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Users</h1>
          <p className="mt-2 text-on-surface-variant">Manage customers and admin accounts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No users found."
      />
    </div>
  );
}
