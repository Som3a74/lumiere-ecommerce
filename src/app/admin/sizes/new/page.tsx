import { SizeForm } from "@/components/admin/size-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewSizePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/sizes"
          className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant hover:text-on-surface"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Add New Size</h1>
          <p className="mt-2 text-on-surface-variant">Create a new size to use for your product variants.</p>
        </div>
      </div>

      <SizeForm />
    </div>
  );
}
