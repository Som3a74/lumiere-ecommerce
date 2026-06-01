"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/admin-products";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  productId: string;
}

export function ProductActions({ productId }: ProductActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        try {
          await deleteProduct(productId);
          toast.success("Product deleted successfully");
        } catch (error: any) {
          toast.error(error.message || "Failed to delete product");
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-surface-variant/50">
        <Link href={`/admin/products/${productId}/edit`} title="Edit">
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isPending}
        className="h-8 w-8 text-error hover:text-error hover:bg-error/10"
        title="Delete"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
