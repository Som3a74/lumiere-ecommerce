import { createClient } from "@/utils/supabase/server";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { DataTable, Column } from "@/components/admin/data-table";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const columns: Column<any>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium text-primary",
    },
    {
      header: "Slug",
      accessorKey: "slug",
    },
    {
      header: "Created At",
      cell: (item) => new Date(item.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <Link
          href={`/admin/categories/${item.id}/edit`}
          className="inline-flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Categories</h1>
          <p className="mt-2 text-on-surface-variant">View all product categories.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center bg-primary text-on-primary px-6 py-3 text-sm font-medium tracking-widest uppercase transition-colors hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Link>
      </div>

      <DataTable
        data={categories || []}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No categories found."
      />
    </div>
  );
}
