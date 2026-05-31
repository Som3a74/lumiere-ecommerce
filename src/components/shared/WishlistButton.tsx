"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleWishlist } from "@/app/actions/wishlist";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  initialIsWishlisted?: boolean;
  className?: string;
  withText?: boolean;
}

export function WishlistButton({
  productId,
  initialIsWishlisted = false,
  className,
  withText = false,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    setIsWishlisted(!isWishlisted);

    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (result?.redirect) {
        router.push(result.redirect);
        // Revert on unauthenticated
        setIsWishlisted(isWishlisted);
        return;
      }
      if (result?.error) {
        console.error(result.error);
        // Revert on error
        setIsWishlisted(isWishlisted);
      } else if (result?.isWishlisted !== undefined) {
        // Sync with server state
        setIsWishlisted(result.isWishlisted);
        if (result.isWishlisted) {
          toast.success("Added to wishlist");
        } else {
          toast("Removed from wishlist");
        }
      }
    });
  };

  if (withText) {
    return (
      <Button 
        variant="ghost"
        size="lg"
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "w-full bg-transparent uppercase border transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 rounded-none",
          isWishlisted 
            ? "border-primary text-primary bg-surface-container-low hover:bg-surface-container-low" 
            : "border-surface-container text-primary hover:border-primary hover:bg-transparent",
          className
        )}
      >
        <span 
          className="material-symbols-outlined text-lg transition-all duration-300"
          style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
        >
          {isWishlisted ? "favorite" : "favorite_border"}
        </span>
        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center justify-center hover:text-primary transition-colors bg-white/80 backdrop-blur-sm rounded-full disabled:opacity-70 hover:bg-white/90",
        isWishlisted ? "text-primary" : "text-primary/50",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <span
        className="material-symbols-outlined text-[20px] transition-all duration-300"
        style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </Button>
  );
}
