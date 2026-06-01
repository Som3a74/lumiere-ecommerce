import { createClient } from "@/utils/supabase/server";
import { ColorForm } from "@/components/admin/color-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditColorPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: color, error } = await supabase
    .from('colors')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !color) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/colors" className="text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Edit Color</h1>
          <p className="mt-2 text-on-surface-variant">{color.name}</p>
        </div>
      </div>

      <ColorForm color={color} />
    </div>
  );
}
