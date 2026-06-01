import { createClient } from "@/utils/supabase/server";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { DataTable, Column } from "@/components/admin/data-table";
import { ColorActions } from "@/components/admin/color-actions";
import { Button } from "@/components/ui/button";

export default async function AdminColorsPage() {
  const supabase = await createClient();
  
  const { data: colors } = await supabase
    .from('colors')
    .select('*')
    .order('name');

  const columns: Column<any>[] = [
    {
      header: "Color Name",
      accessorKey: "name",
      className: "font-medium text-primary",
      cell: (item) => (
        <div className="flex items-center gap-4">
          {item.hex_code && (
            <div 
              className="w-6 h-6 border border-outline-variant/30 rounded-full" 
              style={{ backgroundColor: item.hex_code.startsWith('#') ? item.hex_code : `#${item.hex_code}` }} 
            />
          )}
          <span>{item.name}</span>
        </div>
      )
    },
    {
      header: "Hex Code",
      accessorKey: "hex_code",
      className: "font-mono text-on-surface-variant text-sm",
    },
    {
      header: "Created At",
      cell: (item) => new Date(item.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => <ColorActions colorId={item.id} />
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Colors</h1>
          <p className="mt-2 text-on-surface-variant">Manage colors for product variants.</p>
        </div>
        <Button asChild>
          <Link href="/admin/colors/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Color
          </Link>
        </Button>
      </div>

      <DataTable
        data={colors || []}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No colors found."
      />
    </div>
  );
}
