"use client";

import { useTransition } from "react";
import { addVariant, deleteVariant } from "@/app/actions/admin-products";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Variant {
  id: string;
  color_id: string | null;
  size_id: string | null;
  stock: number;
  sku: string;
  price: number | null;
  color?: { name: string; hex_code: string | null };
  size?: { name: string };
}

interface Color {
  id: string;
  name: string;
  hex_code: string | null;
}

interface Size {
  id: string;
  name: string;
}

interface VariantManagerProps {
  productId: string;
  variants: Variant[];
  colors: Color[];
  sizes: Size[];
}

export function VariantManager({ productId, variants, colors, sizes }: VariantManagerProps) {
  const [isPending, startTransition] = useTransition();

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("product_id", productId);
    
    startTransition(async () => {
      try {
        await addVariant(formData);
        toast.success("Variant added successfully");
        (e.target as HTMLFormElement).reset();
      } catch (error: any) {
        toast.error(error.message || "Failed to add variant");
      }
    });
  };

  const handleDelete = async (variantId: string) => {
    startTransition(async () => {
      try {
        await deleteVariant(variantId, productId);
        toast.success("Variant deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete variant");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-outline-variant/30 p-8">
        <h3 className="font-heading text-xl font-medium tracking-tight text-primary mb-6">Existing Variants</h3>
        
        {variants.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No variants added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-outline-variant/30 uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="py-3 px-4 font-medium">Color</th>
                  <th className="py-3 px-4 font-medium">Size</th>
                  <th className="py-3 px-4 font-medium">Stock</th>
                  <th className="py-3 px-4 font-medium">SKU</th>
                  <th className="py-3 px-4 font-medium">Price Over.</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-surface-variant/10 transition-colors">
                    <td className="py-3 px-4 text-primary font-medium">{variant.color?.name || '-'}</td>
                    <td className="py-3 px-4 text-primary">{variant.size?.name || '-'}</td>
                    <td className="py-3 px-4 text-primary">{variant.stock}</td>
                    <td className="py-3 px-4 text-on-surface-variant font-mono text-xs">{variant.sku}</td>
                    <td className="py-3 px-4 text-primary">{variant.price ? `$${variant.price}` : '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(variant.id)}
                        disabled={isPending}
                        className="text-error hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-surface border border-outline-variant/30 p-8">
        <h3 className="font-heading text-xl font-medium tracking-tight text-primary mb-6">Add New Variant</h3>
        
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">Color</label>
            <Select name="color_id" required>
              <SelectTrigger className="rounded-none focus-visible:ring-primary bg-background">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
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
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">Size</label>
            <Select name="size_id">
              <SelectTrigger className="rounded-none focus-visible:ring-primary h-10 w-full bg-transparent">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map(size => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">Stock</label>
            <Input type="number" name="stock" placeholder="10" required className="rounded-none focus-visible:ring-primary" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">SKU</label>
            <Input name="sku" placeholder="PROD-RED-L" required className="rounded-none focus-visible:ring-primary" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">Price (Opt)</label>
            <Input type="number" step="0.01" name="price" placeholder="Override" className="rounded-none focus-visible:ring-primary" />
          </div>
          <div className="md:col-span-1 flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
