"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveColor } from "@/app/actions/admin-colors";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  hex_code: z.string().optional(),
});

interface Color {
  id: string;
  name: string;
  hex_code: string | null;
}

interface ColorFormProps {
  color?: Color;
}

export function ColorForm({ color }: ColorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: color?.name || "",
      hex_code: color?.hex_code || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        if (values.hex_code) {
          formData.append("hex_code", values.hex_code);
        }
        
        const newId = await saveColor(formData, color?.id);
        toast.success(color ? "Color updated successfully" : "Color created successfully");
        
        if (!color) {
          router.push(`/admin/colors/${newId}/edit`);
        } else {
          router.refresh();
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to save color");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface p-8 border border-outline-variant/30">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Midnight Blue" className="rounded-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hex_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Hex Code (Optional)</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Input placeholder="#000000" className="rounded-none focus-visible:ring-primary font-mono uppercase" {...field} />
                  </FormControl>
                  {field.value && (
                    <div 
                      className="w-10 h-10 border border-outline-variant/30 shrink-0" 
                      style={{ backgroundColor: field.value.startsWith('#') ? field.value : `#${field.value}` }} 
                    />
                  )}
                </div>
                <FormDescription>
                  Used to display color swatches.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {color ? "Save Changes" : "Create Color"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
