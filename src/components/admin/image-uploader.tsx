"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  bucket: string;
  onUploadSuccess: (url: string) => void;
  className?: string;
}

export function ImageUploader({ bucket, onUploadSuccess, className }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast.success("Image uploaded successfully");
      onUploadSuccess(publicUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error uploading image");
        console.error(error);
      } else {
        toast.error("Error uploading image");
        console.error(error);
      }
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className={cn("relative", className)}>
      <label className={cn(
        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant/50 bg-surface-variant/20 hover:bg-surface-variant/40 transition-colors cursor-pointer",
        isUploading && "opacity-50 cursor-not-allowed"
      )}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-on-surface-variant animate-spin mb-2" />
          ) : (
            <UploadCloud className="w-8 h-8 text-on-surface-variant mb-2" />
          )}
          <p className="text-sm text-on-surface-variant uppercase tracking-wider font-medium">
            {isUploading ? "Uploading..." : "Click to upload image"}
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
