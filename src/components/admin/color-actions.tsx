"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { deleteColor } from "@/app/actions/admin-colors";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ColorActionsProps {
  colorId: string;
}

export function ColorActions({ colorId }: ColorActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this color?")) {
      startTransition(async () => {
        try {
          await deleteColor(colorId);
          toast.success("Color deleted successfully");
        } catch (error: any) {
          toast.error(error.message || "Failed to delete color");
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-surface-variant/50">
        <Link href={`/admin/colors/${colorId}/edit`} title="Edit">
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
