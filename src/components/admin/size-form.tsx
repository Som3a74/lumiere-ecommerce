"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveSize } from "@/app/actions/admin-sizes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SizeFormProps {
  size?: { id: string; name: string } | null;
}

export function SizeForm({ size }: SizeFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function action(formData: FormData) {
    if (size) formData.append("id", size.id);
    startTransition(async () => {
      try {
        await saveSize(formData);
        toast.success(size ? "Size updated" : "Size created");
        router.push("/admin/sizes");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Failed to save size");
      }
    });
  }

  return (
    <form action={action} className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      <div className="bg-surface border border-outline-variant/30 p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Size Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={size?.name}
              placeholder="e.g. XS, XL, 42"
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {size ? "Save Changes" : "Create Size"}
          </Button>
        </div>
      </div>
    </form>
  );
}
