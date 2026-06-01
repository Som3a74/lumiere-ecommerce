import { ColorForm } from "@/components/admin/color-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewColorPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/colors" className="text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">New Color</h1>
          <p className="mt-2 text-on-surface-variant">Add a new color option for products.</p>
        </div>
      </div>

      <ColorForm />
    </div>
  );
}
