import { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Loader2, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductVariantsSection({
  colors,
  sizes,
  productId,
  generateId,
  isNewProduct,
  onUploadingChange
}: {
  colors: any[];
  sizes: any[];
  productId: string;
  generateId: () => string;
  isNewProduct: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const form = useFormContext();
  const [uploadingVariantId, setUploadingVariantId] = useState<number | null>(null);
  const supabase = createClient();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "colorGroups",
  });

  const watchedColorGroups = form.watch("colorGroups");

  useEffect(() => {
    if (isNewProduct && fields.length === 0) {
      append({
        color_id: "none",
        sizes: [],
        images: [],
        base_stock: 0,
        base_sku: "",
        base_price: null
      });
    }
  }, [isNewProduct, fields.length, append]);

  const generateSku = (colorId: string | null | undefined, sizeId: string | null | undefined) => {
    const pId = productId;
    
    const colorName = colorId && colorId !== "none" ? (colors.find(c => c.id === colorId)?.name || "BASE") : "BASE";
    const sizeName = sizeId ? (sizes.find(s => s.id === sizeId)?.name || "BASE") : "BASE";
    
    const idPrefix = pId ? pId.substring(0, 4).toUpperCase() : "[AUTO]";
    const cStr = colorName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const sStr = sizeName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    return `${idPrefix}-${cStr}-${sStr}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVariantId(index);
    if (onUploadingChange) onUploadingChange(true);
    try {
      const fileExt = file.name.split('.').pop();
      const pId = productId || generateId();
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
      if (onUploadingChange) onUploadingChange(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeImage = (groupIndex: number, imageIndex: number) => {
    const currentImages = form.getValues(`colorGroups.${groupIndex}.images`) || [];
    const newImages = [...currentImages];
    newImages.splice(imageIndex, 1);
    form.setValue(`colorGroups.${groupIndex}.images`, newImages);
  };

  const handleSizeToggle = (groupIndex: number, sizeId: string | null | undefined) => {
    if (!sizeId) return;
    
    const currentSizes = form.getValues(`colorGroups.${groupIndex}.sizes`) || [];
    const existingIndex = currentSizes.findIndex((s: any) => s.size_id === sizeId);
    
    if (existingIndex >= 0) {
      const removedSize = sizes.find(s => s.id === sizeId)?.name || "Size";
      const newSizes = [...currentSizes];
      newSizes.splice(existingIndex, 1);
      form.setValue(`colorGroups.${groupIndex}.sizes`, newSizes);
      toast.info(`${removedSize} removed from variants`);
    } else {
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
                      currentSizes.forEach((s: any, sIdx: number) => {
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
                const isSelected = watchedColorGroups?.[index]?.sizes?.some((s: any) => s.size_id === size.id);
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
                  {watchedColorGroups[index]?.sizes?.map((sizeVariant: any, sizeIndex: number) => {
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
              {watchedColorGroups?.[index]?.images?.map((imgUrl: string, imgIndex: number) => (
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
  );
}
