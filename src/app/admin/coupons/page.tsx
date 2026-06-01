import { createClient } from "@/utils/supabase/server";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { DataTable, Column } from "@/components/admin/data-table";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  const columns: Column<any>[] = [
    {
      header: "Code",
      accessorKey: "code",
      className: "font-medium tracking-widest uppercase text-primary",
    },
    {
      header: "Discount (%)",
      cell: (item) => `${item.discount_percentage}%`,
    },
    {
      header: "Expiration",
      cell: (item) => item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : "Never",
    },
    {
      header: "Status",
      cell: (item) => (
        <span className={item.is_active ? "text-success" : "text-error"}>
          {item.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <Link
          href={`/admin/coupons/${item.id}/edit`}
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
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Coupons</h1>
          <p className="mt-2 text-on-surface-variant">Manage discount codes and promotions.</p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center justify-center bg-primary text-on-primary px-6 py-3 text-sm font-medium tracking-widest uppercase transition-colors hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Link>
      </div>

      <DataTable
        data={coupons || []}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No coupons found."
      />
    </div>
  );
}
