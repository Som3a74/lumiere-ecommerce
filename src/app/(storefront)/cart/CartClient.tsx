"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { removeCartItem, updateCartItemQuantity } from "@/app/actions/cart";
import { applyCoupon, removeCoupon } from "@/app/actions/coupons";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";

interface CartClientProps {
  cartItems: any[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  coupon: any | null;
}

export default function CartClient({ cartItems, totals, coupon }: CartClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<{ id: string, type: 'remove' | 'update' } | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    startTransition(async () => {
      const result = await applyCoupon(couponCode);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
      setIsApplyingCoupon(false);
      setCouponCode("");
    });
  };

  const handleRemoveCoupon = () => {
    startTransition(async () => {
      const result = await removeCoupon();
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  const handleRemove = (id: string) => {
    setPendingAction({ id, type: 'remove' });
    startTransition(async () => {
      const result = await removeCartItem(id);
      if (result.error) toast.error(result.error);
      else toast.success("Item removed from cart");
      setPendingAction(null);
    });
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setPendingAction({ id, type: 'update' });
    startTransition(async () => {
      const result = await updateCartItemQuantity(id, newQuantity);
      if (result.error) toast.error(result.error);
      setPendingAction(null);
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 text-center">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-6">Your Cart is Empty</h1>
        <p className="font-body-lg text-secondary mb-12">Looks like you haven't added anything to your cart yet.</p>
        <Button
          asChild
          variant="default"
          size="lg"
          className="rounded-none uppercase text-on-primary"
        >
          <Link href="/collections">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* Left Column: Cart Items */}
      <div className="lg:col-span-8 flex flex-col space-y-8">
        <div className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-surface-container pb-4">
          Shopping Cart
        </div>

        <div className="space-y-8">
          {cartItems.map((item) => {
            const product = Array.isArray(item.product) ? item.product[0] : item.product;
            
            let matchingImages = product?.product_images || [];
            if (item.color_id) {
              const colorImages = matchingImages.filter((img: any) => img.color_id === item.color_id);
              if (colorImages.length > 0) matchingImages = colorImages;
            }
            
            const imageUrl = matchingImages[0]?.image_url || "/placeholder-image.jpg";

            return (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-surface-container">
                <div className="w-full sm:w-40 h-40 bg-surface-dim overflow-hidden flex-shrink-0 relative">
                  <Image
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    alt={product?.name || "Product"}
                    src={imageUrl}
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-primary text-[22px] mb-2">{product?.name || "Unknown"}</h3>
                      {item.color && <p className="font-body-md text-secondary mb-1">Color: {item.color}</p>}
                      {item.size && <p className="font-body-md text-secondary mb-1">Size: {item.size}</p>}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-body-md text-secondary">Quantity:</span>
                        <div className="flex items-center border border-surface-container rounded-sm overflow-hidden">
                          <button
                            disabled={isPending && pendingAction?.id === item.id}
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 bg-surface-bright hover:bg-surface-dim transition-colors text-primary disabled:opacity-50"
                          >-</button>
                          <span className="px-4 py-1 text-primary font-body-md bg-background">{item.quantity}</span>
                          <button
                            disabled={isPending && pendingAction?.id === item.id}
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 bg-surface-bright hover:bg-surface-dim transition-colors text-primary disabled:opacity-50"
                          >+</button>
                        </div>
                      </div>
                    </div>
                    <div className="font-headline-md text-primary">
                      ${(product?.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <Button
                      variant="link"
                      onClick={() => handleRemove(item.id)}
                      disabled={isPending && pendingAction?.id === item.id}
                      className="px-0 font-label-caps text-label-caps text-secondary hover:text-error underline underline-offset-4 transition-colors uppercase tracking-widest disabled:opacity-50"
                    >
                      {isPending && pendingAction?.id === item.id && pendingAction?.type === 'remove' ? "Removing..." : "Remove"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-4 relative">
        <div className="md:sticky top-32 bg-surface-container-low p-8 rounded-DEFAULT">
          <h2 className="font-headline-md text-headline-md text-primary mb-6">Order Summary</h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between font-body-md text-secondary">
              <span>Subtotal</span>
              <span>${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between font-body-md text-secondary">
                <span>Discount ({coupon?.code})</span>
                <span className="text-primary">- ${totals.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between font-body-md text-secondary">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-body-md text-secondary">
              <span>Estimated Tax (8%)</span>
              <span>${totals.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-headline-md text-primary pt-4 border-t border-surface-container">
              <span>Total</span>
              <span>${totals.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="mb-8">
            {coupon ? (
              <div className="flex items-center justify-between border-b border-surface-container pb-2">
                <div className="font-body-md text-primary">
                  Coupon applied: <span className="font-headline-md">{coupon.code}</span>
                </div>
                <Button
                  variant="link"
                  onClick={handleRemoveCoupon}
                  disabled={isPending}
                  className="px-0 font-label-caps text-secondary hover:text-error uppercase tracking-widest disabled:opacity-50"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-end gap-4">
                <div className="flex-grow">
                  <FloatingInput
                    id="coupon"
                    label="Promo Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isApplyingCoupon || isPending}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || isApplyingCoupon || isPending}
                  className="rounded-none uppercase text-primary border-surface-container hover:bg-surface-container transition-colors font-label-caps tracking-widest"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
            )}
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={() => router.push("/checkout")}
            className="w-full rounded-none uppercase text-on-primary flex justify-center items-center gap-2"
          >
            Proceed to Checkout
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
