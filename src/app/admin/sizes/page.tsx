import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Plus } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { SizeActions } from "@/components/admin/size-actions";
import { Button } from "@/components/ui/button";

export default async function AdminSizesPage() {
  const supabase = await createClient();
  const { data: sizes } = await supabase
    .from("sizes")
    .select("*")
    .order("created_at", { ascending: false });

  const columns: Column<any>[] = [
    {
      header: "Size Name",
      accessorKey: "name",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (item) => new Date(item.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => <SizeActions sizeId={item.id} />
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Sizes</h1>
          <p className="mt-2 text-on-surface-variant">Manage your product sizes catalog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/sizes/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Size
          </Link>
        </Button>
      </div>

      <DataTable
        data={sizes || []}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No sizes found."
      />
    </div>
  );
}
