"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductImage {
  id: string;
  image_url: string;
  is_thumbnail: boolean;
  display_order: number;
  color: string | null;
}

interface Color {
  id: string;
  name: string;
  hex_code: string | null;
}

interface ImageManagerProps {
  productId: string;
  images: ProductImage[];
  colors: Color[];
}

export function ImageManager({ productId, images, colors }: ImageManagerProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    startTransition(async () => {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}-${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: imageUrl,
            color: (color && color !== "none") ? color : null,
            display_order: images.length,
            is_thumbnail: images.length === 0, // First image is thumbnail
          });

        if (insertError) throw new Error(insertError.message);

        toast.success("Image uploaded successfully");
        setFile(null);
        setColor("");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Failed to upload image");
      }
    });
  };

  const handleDelete = async (imageId: string) => {
    startTransition(async () => {
      try {
        const { error } = await supabase
          .from('product_images')
          .delete()
          .eq('id', imageId);
          
        if (error) throw new Error(error.message);
        
        toast.success("Image deleted successfully");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete image");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-outline-variant/30 p-8">
        <h3 className="font-heading text-xl font-medium tracking-tight text-primary mb-6">Product Images</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square border border-outline-variant/30 bg-surface-variant/20 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt="Product image" className="object-cover w-full h-full" />
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <span className="text-white text-xs font-medium uppercase tracking-wider bg-black/50 px-2 py-1 self-start">
                  {img.color || "Base"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(img.id)}
                  disabled={isPending}
                  className="text-white hover:text-error hover:bg-black/50 self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-on-surface-variant">
              No images uploaded yet.
            </div>
          )}
        </div>

        <div className="border-t border-outline-variant/30 pt-8 mt-8">
          <h4 className="font-heading text-lg font-medium tracking-tight text-primary mb-4">Upload New Image</h4>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">Image File</label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="rounded-none focus-visible:ring-primary h-10 file:mr-4 file:py-1 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-medium file:bg-surface-variant file:text-primary hover:file:bg-surface-variant/80" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">Link to Color (Optional)</label>
              <Select onValueChange={setColor} value={color}>
                <SelectTrigger className="rounded-none focus-visible:ring-primary h-10 bg-background">
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {colors.map(c => (
                    <SelectItem key={c.id} value={c.name}>
                      <div className="flex items-center gap-2">
                        {c.hex_code && <div className="w-3 h-3 rounded-full border border-outline-variant/30" style={{ backgroundColor: c.hex_code.startsWith('#') ? c.hex_code : `#${c.hex_code}` }} />}
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleUpload}
              disabled={!file || isPending} 
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
