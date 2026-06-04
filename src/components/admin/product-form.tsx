"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveProduct } from "@/app/actions/admin-products";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductBasicDetails } from "./product-basic-details";
import { ProductVariantsSection } from "./product-variants-section";

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const sizeVariantSchema = z.object({
  id: z.string(),
  size_id: z.string().optional().nullable(),
  stock: z.coerce.number().min(0),
  sku: z.string().optional(),
  price: z.coerce.number().optional().nullable(),
});

const colorGroupSchema = z.object({
  color_id: z.string().optional().nullable(),
  sizes: z.array(sizeVariantSchema).default([]),
  images: z.array(z.string()).default([]),
  base_stock: z.coerce.number().min(0).default(0),
  base_price: z.coerce.number().optional().nullable(),
  base_sku: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category_id: z.string().min(1, "Category is required"),
  features: z.string().optional(),
  colorGroups: z.array(colorGroupSchema).default([]),
});

interface Category { id: string; name: string; }
interface Color { id: string; name: string; hex_code: string | null; }
interface Size { id: string; name: string; }

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  features: string[];
  colorGroups?: z.infer<typeof colorGroupSchema>[];
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  colors?: Color[];
  sizes?: Size[];
  initialProductId?: string;
}

export function ProductForm({ product, categories, colors = [], sizes = [], initialProductId }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category_id: product?.category_id || "",
      features: product?.features?.join(", ") || "",
      colorGroups: product?.colorGroups || [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        if (initialProductId && !product) {
          formData.append("id", initialProductId);
        }
        
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("price", values.price.toString());
        formData.append("category_id", values.category_id);
        if (values.features) {
          formData.append("features", values.features);
        }
      
        const processedGroups = values.colorGroups.map(cg => ({
          color_id: cg.color_id === "none" ? null : cg.color_id,
          images: cg.images,
          sizes: cg.sizes.map(s => ({
            ...s,
            size_id: s.size_id === "none" ? null : s.size_id,
          }))
        }));
        formData.append("colorGroups", JSON.stringify(processedGroups));
        
        const newId = await saveProduct(formData, product?.id);
        toast.success(product ? "Product updated successfully" : "Product created successfully");
        
        if (!product) {
          router.push(`/admin/products/${newId}/edit`);
        } else {
          router.refresh();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to save product");
        } else {
          toast.error("Failed to save product");
        }
      }
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <ProductBasicDetails categories={categories} />
        
        <ProductVariantsSection 
          colors={colors}
          sizes={sizes}
          productId={product?.id || initialProductId || ""}
          generateId={generateId}
          isNewProduct={!product}
          onUploadingChange={setIsUploadingImage}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending || isUploadingImage} className="w-full md:w-auto min-w-[200px]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Save Changes" : "Create Product & Variants"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
