"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { deleteSize } from "@/app/actions/admin-sizes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SizeActionsProps {
  sizeId: string;
}

export function SizeActions({ sizeId }: SizeActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this size?")) {
      startTransition(async () => {
        try {
          await deleteSize(sizeId);
          toast.success("Size deleted successfully");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message || "Failed to delete size");
          } else {
            toast.error("Failed to delete size");
          }
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-surface-variant/50">
        <Link href={`/admin/sizes/${sizeId}/edit`} title="Edit">
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
