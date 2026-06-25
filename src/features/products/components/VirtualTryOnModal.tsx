"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImage: string;
}

export function VirtualTryOnModal({ isOpen, onClose, productImage }: VirtualTryOnModalProps) {
  const [userImageBase64, setUserImageBase64] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUserImageBase64(event.target?.result as string);
      setResultImage(null); // Reset result if a new image is uploaded
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!userImageBase64) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);
    toast.info("Connecting securely to AI... Please wait.");
    
    try {
      // Format product image URL
      const productImageUrl = productImage.startsWith("/") 
        ? window.location.origin + productImage 
        : productImage;

      const response = await fetch('/api/virtual-try-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userImageBase64,
          productImageUrl
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success && result.imageUrl) {
        setResultImage(result.imageUrl);
        toast.success("Virtual try-on completed!");
      } else {
        toast.error(result.error || "Failed to generate image.");
      }
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetState = () => {
    setUserImageBase64(null);
    setResultImage(null);
    setIsGenerating(false);
  };

  const handleClose = () => {
    if (!isGenerating) {
      onClose();
      // Wait for modal animation before resetting
      setTimeout(resetState, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl bg-surface border-surface-container">
        <DialogHeader>
          <DialogTitle className="text-primary font-display-sm">Virtual Try-On</DialogTitle>
          <DialogDescription className="text-secondary">
            See how this product looks on you by uploading a photo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left Column: Input */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-label-caps text-label-caps text-primary uppercase">Your Photo</h3>
            
            {!userImageBase64 ? (
              <div 
                className="border-2 border-dashed border-surface-container hover:border-primary/50 transition-colors rounded-lg h-64 flex flex-col items-center justify-center p-4 cursor-pointer bg-surface-dim group"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-secondary mb-3 group-hover:text-primary transition-colors" />
                <p className="text-secondary text-sm text-center mb-1 font-medium">Click to upload a photo</p>
                <p className="text-secondary/70 text-xs text-center">JPEG, PNG up to 5MB</p>
                <p className="text-secondary/70 text-xs text-center mt-2 px-4">
                  For best results, use a well-lit photo showing your upper body clearly.
                </p>
              </div>
            ) : (
              <div className="relative h-64 rounded-lg overflow-hidden border border-surface-container bg-surface-dim">
                <Image 
                  src={userImageBase64} 
                  alt="User photo" 
                  fill 
                  className="object-cover"
                />
                <button 
                  onClick={() => setUserImageBase64(null)}
                  className="absolute top-2 right-2 bg-surface/80 hover:bg-surface p-1.5 rounded-full text-primary backdrop-blur-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              accept="image/jpeg,image/png,image/webp" 
              className="hidden" 
            />

            <Button 
              onClick={handleGenerate} 
              disabled={!userImageBase64 || isGenerating}
              className="w-full flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Try it on me
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Result */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-label-caps text-label-caps text-primary uppercase">Result</h3>
            
            <div className="border border-surface-container rounded-lg h-64 flex flex-col items-center justify-center bg-surface-dim relative overflow-hidden">
              {resultImage ? (
                <Image 
                  src={resultImage} 
                  alt="Virtual try-on result" 
                  fill 
                  className="object-contain"
                />
              ) : isGenerating ? (
                <div className="flex flex-col items-center space-y-3 px-6 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-surface-container border-t-primary animate-spin"></div>
                  <p className="text-primary text-sm font-medium">AI is working its magic...</p>
                  <p className="text-secondary text-xs">This usually takes about 5-10 seconds.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-50 px-6 text-center">
                  <Sparkles className="w-8 h-8 text-secondary mb-2" />
                  <p className="text-secondary text-sm">Your generated image will appear here.</p>
                </div>
              )}
            </div>
            
            {resultImage && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resultImage;
                  link.download = 'virtual-try-on.jpg';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download Result
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
