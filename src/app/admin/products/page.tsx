import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Plus } from "lucide-react";
import Image from "next/image";
import { DataTable, Column } from "@/components/admin/data-table";
import { ProductActions } from "@/components/admin/product-actions";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      created_at,
      categories ( name ),
      product_images ( image_url )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const columns: Column<any>[] = [
    {
      header: "Product",
      accessorKey: "name",
      className: "font-medium text-primary",
      cell: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-variant/20 border border-outline-variant/30 overflow-hidden flex-shrink-0 relative">
            {item.product_images?.[0]?.image_url ? (
              <Image src={item.product_images[0].image_url} alt={item.name} fill sizes="48px" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">No Img</div>
            )}
          </div>
          <span>{item.name}</span>
        </div>
      )
    },
    {
      header: "Category",
      cell: (item) => item.categories?.name || "Uncategorized",
    },
    {
      header: "Price",
      cell: (item) => `$${item.price.toFixed(2)}`,
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => <ProductActions productId={item.id} />
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Products</h1>
          <p className="mt-2 text-on-surface-variant">Manage your product catalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center bg-primary text-on-primary px-6 py-3 text-sm font-medium tracking-widest uppercase transition-colors hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <DataTable
        data={products || []}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No products found."
      />
    </div>
  );
}
