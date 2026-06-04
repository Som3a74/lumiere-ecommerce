"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveProduct } from "@/app/actions/admin-products";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

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
  const supabase = createClient();
  const [uploadingVariantId, setUploadingVariantId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category_id: product?.category_id || "",
      features: product?.features?.join(", ") || "",
      colorGroups: product?.colorGroups || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "colorGroups",
  });

  const watchedColorGroups = form.watch("colorGroups");

  // Ensure there's at least one variant box if new product
  useEffect(() => {
    if (!product && fields.length === 0) {
      append({
        color_id: "none",
        sizes: [],
        images: [],
        base_stock: 0,
        base_sku: "",
        base_price: null
      });
    }
  }, [product, fields.length, append]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVariantId(index);
    try {
      const fileExt = file.name.split('.').pop();
      const pId = initialProductId || product?.id || generateId();
      const fileName = `${pId}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const currentImages = form.getValues(`colorGroups.${index}.images`) || [];
      form.setValue(`colorGroups.${index}.images`, [...currentImages, publicUrlData.publicUrl]);
      toast.success("Image uploaded");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to upload image");
      } else {
        toast.error("Failed to upload image");
      }
    } finally {
      setUploadingVariantId(null);
      if (e.target) e.target.value = '';
    }
  };

  const removeImage = (groupIndex: number, imageIndex: number) => {
    const currentImages = form.getValues(`colorGroups.${groupIndex}.images`) || [];
    const newImages = [...currentImages];
    newImages.splice(imageIndex, 1);
    form.setValue(`colorGroups.${groupIndex}.images`, newImages);
  };

  const generateSku = (colorId: string | null | undefined, sizeId: string | null | undefined) => {
    const pId = product?.id || initialProductId;
    
    const colorName = colorId && colorId !== "none" ? (colors.find(c => c.id === colorId)?.name || "BASE") : "BASE";
    const sizeName = sizeId ? (sizes.find(s => s.id === sizeId)?.name || "BASE") : "BASE";
    
    // Format: first 4 chars of ID - COLOR - SIZE
    const idPrefix = pId ? pId.substring(0, 4).toUpperCase() : "[AUTO]";
    const cStr = colorName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const sStr = sizeName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    return `${idPrefix}-${cStr}-${sStr}`;
  };

  const handleSizeToggle = (groupIndex: number, sizeId: string | null | undefined) => {
    if (!sizeId) return;
    
    const currentSizes = form.getValues(`colorGroups.${groupIndex}.sizes`) || [];
    const existingIndex = currentSizes.findIndex(s => s.size_id === sizeId);
    
    if (existingIndex >= 0) {
      // Remove
      const removedSize = sizes.find(s => s.id === sizeId)?.name || "Size";
      const newSizes = [...currentSizes];
      newSizes.splice(existingIndex, 1);
      form.setValue(`colorGroups.${groupIndex}.sizes`, newSizes);
      toast.info(`${removedSize} removed from variants`);
    } else {
      // Add
      const colorId = form.getValues(`colorGroups.${groupIndex}.color_id`);
      
      form.setValue(`colorGroups.${groupIndex}.sizes`, [...currentSizes, {
        id: generateId(),
        size_id: sizeId,
        stock: 0,
        sku: generateSku(colorId, sizeId),
        price: null
      }]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-surface border border-outline-variant/30 p-8 space-y-6">
          <h2 className="font-heading text-xl font-medium tracking-tight text-primary">Basic Details</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Product Name</FormLabel>
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
                <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Description</FormLabel>
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
                  <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Base Price ($)</FormLabel>
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
                  <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="rounded-none focus-visible:ring-primary bg-transparent">
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
                <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Features (Comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Water resistant, Sapphire crystal" className="rounded-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-medium tracking-tight text-primary">Variants (Colors & Sizes)</h2>
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-none border-outline-variant/30"
              onClick={() => append({ color_id: "none", sizes: [], images: [], base_stock: 0, base_sku: "", base_price: null })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Color Group
            </Button>
          </div>

            {fields.map((field, index) => (
              <div key={field.id} className="bg-surface border border-outline-variant/30 p-6 relative group">
                <div className="absolute top-4 right-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-error hover:bg-error/10 hover:text-error"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mb-6 max-w-sm">
                  <FormField
                    control={form.control}
                    name={`colorGroups.${index}.color_id`}
                    render={({ field: colorField }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Color</FormLabel>
                        <Select 
                          onValueChange={(val) => {
                            colorField.onChange(val);
                            const currentSizes = form.getValues(`colorGroups.${index}.sizes`) || [];
                            currentSizes.forEach((s, sIdx) => {
                              form.setValue(
                                `colorGroups.${index}.sizes.${sIdx}.sku`, 
                                generateSku(val, s.size_id)
                              );
                            });
                          }} 
                          value={colorField.value || "none"}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-none focus-visible:ring-primary bg-background">
                              <SelectValue placeholder="Select Color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {colors.map(c => (
                              <SelectItem key={c.id} value={c.id}>
                                <div className="flex items-center gap-2">
                                  {c.hex_code && <div className="w-3 h-3 rounded-full border border-outline-variant/30" style={{ backgroundColor: c.hex_code.startsWith('#') ? c.hex_code : `#${c.hex_code}` }} />}
                                  {c.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-6">
                  <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs block mb-3">Sizes</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => {
                      const isSelected = watchedColorGroups?.[index]?.sizes?.some(s => s.size_id === size.id);
                      return (
                        <Button
                          key={size.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleSizeToggle(index, size.id)}
                          className="rounded-none"
                        >
                          {size.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {watchedColorGroups?.[index]?.sizes?.length > 0 ? (
                  <div className="border border-outline-variant/30 rounded-none overflow-hidden mb-6">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-surface-variant/30 text-on-surface-variant uppercase tracking-widest text-xs">
                        <tr>
                          <th className="px-4 py-3 font-medium">Size</th>
                          <th className="px-4 py-3 font-medium">Stock</th>
                          <th className="px-4 py-3 font-medium">Price Over.</th>
                          <th className="px-4 py-3 font-medium w-full">SKU (Auto)</th>
                          <th className="px-4 py-3 font-medium text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        {watchedColorGroups[index]?.sizes?.map((sizeVariant, sizeIndex) => {
                          const sizeName = sizeVariant.size_id ? sizes.find(s => s.id === sizeVariant.size_id)?.name || "Unknown" : "Unknown";
                          return (
                            <tr key={sizeVariant.id} className="bg-background/50 hover:bg-surface-variant/10 transition-colors">
                              <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">
                                {sizeName}
                              </td>
                              <td className="px-4 py-3">
                                <Input 
                                  type="number" 
                                  className="rounded-none focus-visible:ring-primary h-8 w-24" 
                                  {...form.register(`colorGroups.${index}.sizes.${sizeIndex}.stock`)} 
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="Inherit" 
                                  className="rounded-none focus-visible:ring-primary h-8 w-28" 
                                  {...form.register(`colorGroups.${index}.sizes.${sizeIndex}.price`)} 
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Input 
                                  placeholder="Auto" 
                                  className="rounded-none focus-visible:ring-primary h-8 min-w-[120px]" 
                                  {...form.register(`colorGroups.${index}.sizes.${sizeIndex}.sku`)} 
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-error hover:bg-error/10 hover:text-error h-8 w-8"
                                  onClick={() => handleSizeToggle(index, sizeVariant.size_id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-surface-variant/10 border border-outline-variant/30">
                    <FormField
                      control={form.control}
                      name={`colorGroups.${index}.base_stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Stock</FormLabel>
                          <FormControl>
                            <Input type="number" className="rounded-none focus-visible:ring-primary bg-background" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`colorGroups.${index}.base_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Price Override</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Inherit from product" className="rounded-none focus-visible:ring-primary bg-background" {...field} value={field.value ?? ""} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`colorGroups.${index}.base_sku`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">SKU</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input placeholder="Auto" className="rounded-none focus-visible:ring-primary bg-background" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-none shrink-0"
                              onClick={() => {
                                const colorId = form.getValues(`colorGroups.${index}.color_id`);
                                form.setValue(`colorGroups.${index}.base_sku`, generateSku(colorId, null));
                              }}
                              title="Generate SKU"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="border-t border-outline-variant/20 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Color Images</FormLabel>
                    <div className="relative w-[140px]">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                        onChange={(e) => handleImageUpload(e, index)}
                        disabled={uploadingVariantId === index}
                      />
                      <Button type="button" variant="secondary" size="sm" className="rounded-none pointer-events-none w-full" disabled={uploadingVariantId === index}>
                        {uploadingVariantId === index ? (
                          <div className="flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2 shrink-0" />
                            <span>Uploading</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Upload className="w-4 h-4 mr-2 shrink-0" />
                            <span>Upload Image</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {watchedColorGroups?.[index]?.images?.map((imgUrl, imgIndex) => (
                      <div key={imgIndex} className="relative group w-24 h-24 flex-shrink-0 border border-outline-variant/30 bg-surface-variant/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt="Variant image" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeImage(index, imgIndex)}
                            className="text-white hover:text-error hover:bg-transparent"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!watchedColorGroups?.[index]?.images || watchedColorGroups[index].images.length === 0) && (
                      <div className="w-full py-8 border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-on-surface-variant bg-surface-variant/5">
                        <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                        <span className="text-xs uppercase tracking-widest">No Images</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending || uploadingVariantId !== null} className="w-full md:w-auto min-w-[200px]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Save Changes" : "Create Product & Variants"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
