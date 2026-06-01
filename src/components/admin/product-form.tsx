"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveProduct } from "@/app/actions/admin-products";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category_id: z.string().min(1, "Category is required"),
  features: z.string().optional(),
});

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  features: string[];
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category_id: product?.category_id || "",
      features: product?.features?.join(", ") || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("price", values.price.toString());
        formData.append("category_id", values.category_id);
        if (values.features) {
          formData.append("features", values.features);
        }
        
        const newId = await saveProduct(formData, product?.id);
        toast.success(product ? "Product updated successfully" : "Product created successfully");
        
        if (!product) {
          router.push(`/admin/products/${newId}/edit`);
        } else {
          router.refresh();
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to save product");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-surface border border-outline-variant/30 p-8 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Classic Watch" className="rounded-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Product description..." className="rounded-none resize-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-widest text-on-surface-variant">Base Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" className="rounded-none focus-visible:ring-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-widest text-on-surface-variant">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none focus-visible:ring-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Features (Comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Water resistant, Sapphire crystal" className="rounded-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
