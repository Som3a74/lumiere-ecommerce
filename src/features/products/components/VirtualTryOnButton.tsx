"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { VirtualTryOnModal } from "./VirtualTryOnModal";

interface VirtualTryOnButtonProps {
  productImage: string;
}

export function VirtualTryOnButton({ productImage }: VirtualTryOnButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsModalOpen(true)}
        className="w-full rounded-none uppercase flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        See it on myself
      </Button>

      <VirtualTryOnModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productImage={productImage}
      />
    </>
  );
}
