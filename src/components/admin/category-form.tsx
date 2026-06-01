"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveCategory } from "@/app/actions/admin-categories";
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
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
});

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("slug", values.slug);
        
        const newId = await saveCategory(formData, category?.id);
        toast.success(category ? "Category updated successfully" : "Category created successfully");
        
        if (!category) {
          router.push(`/admin/categories/${newId}/edit`);
        } else {
          router.refresh();
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to save category");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface p-8 border border-outline-variant/30">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Watches" className="rounded-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. watches" className="rounded-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used in the URL. Must be lowercase and contain no spaces.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {category ? "Save Changes" : "Create Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
