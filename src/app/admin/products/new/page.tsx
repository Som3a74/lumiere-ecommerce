import { createClient } from "@/utils/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">New Product</h1>
          <p className="mt-2 text-on-surface-variant">Add a new product to your catalog.</p>
        </div>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  );
}
