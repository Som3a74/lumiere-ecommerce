import { createClient } from "@/utils/supabase/server";
import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !category) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Edit Category</h1>
          <p className="mt-2 text-on-surface-variant">{category.name}</p>
        </div>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
