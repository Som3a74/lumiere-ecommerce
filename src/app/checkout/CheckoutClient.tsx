"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutInput } from "@/lib/validations/checkout";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { placeOrder } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";

interface CheckoutClientProps {
  userProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  cartItems: any[];
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
}

export default function CheckoutClient({ userProfile, cartItems, totals }: CheckoutClientProps) {
  const router = useRouter();
  const [openAccordion, setOpenAccordion] = useState<string>("contact-info");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: userProfile.email || "",
      phone: userProfile.phone || "",
      fname: userProfile.firstName || "",
      lname: userProfile.lastName || "",
      address: "",
      city: "",
      country: "",
      zip: "",
      card: "",
      exp: "",
      cvc: ""
    }
  });

  const nextStep = (id: string) => {
    setOpenAccordion(id);
  };

  const onSubmit = async (data: CheckoutInput) => {
    setIsPlacingOrder(true);
    
    const contactInfo = {
      email: data.email,
      phone: data.phone,
      firstName: data.fname,
      lastName: data.lname,
    };
    
    const shippingAddress = {
      address: data.address,
      city: data.city,
      country: data.country,
      zip: data.zip,
    };
    
    const paymentInfo = {
      card: data.card.slice(-4), // Only store last 4 digits mock
      exp: data.exp,
    };

    const result = await placeOrder(cartItems, totals, contactInfo, shippingAddress, paymentInfo);
    
    setIsPlacingOrder(false);
    
    if (result.success) {
      toast.success(result.message);
      router.push("/my-account");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* Left Column: Checkout Steps */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-8">
        <div className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-surface-container pb-4">
          Secure Checkout
        </div>

        <Accordion type="single" value={openAccordion} onValueChange={setOpenAccordion} className="w-full">
          {/* Accordion 1: Contact Info */}
          <AccordionItem value="contact-info" className="border-b border-surface-container pb-2">
            <AccordionTrigger className="font-headline-md text-headline-md text-primary hover:text-tertiary-fixed-dim transition-colors py-4 hover:no-underline">
              1. Contact Information
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1"><FloatingInput id="email" label="Email Address" type="email" {...register("email")} />{errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}</div>
                <div className="flex flex-col gap-1"><FloatingInput id="phone" label="Phone Number" type="tel" {...register("phone")} />{errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}</div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="default"
                  size="lg"
                  type="button"
                  className="rounded-none uppercase text-on-primary"
                  onClick={() => nextStep("shipping-address")}
                >
                  Continue to Shipping
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion 2: Shipping Address */}
          <AccordionItem value="shipping-address" className="border-b border-surface-container pb-2">
            <AccordionTrigger className="font-headline-md text-headline-md text-primary hover:text-tertiary-fixed-dim transition-colors py-4 hover:no-underline">
              2. Shipping Address
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1"><FloatingInput id="fname" label="First Name" type="text" {...register("fname")} />{errors.fname && <span className="text-red-500 text-sm">{errors.fname.message}</span>}</div>
                <div className="flex flex-col gap-1"><FloatingInput id="lname" label="Last Name" type="text" {...register("lname")} />{errors.lname && <span className="text-red-500 text-sm">{errors.lname.message}</span>}</div>
              </div>
              <div className="flex flex-col gap-1"><FloatingInput id="address" label="Address" type="text" {...register("address")} />{errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}</div>
              <div className="flex flex-col gap-1"><FloatingInput id="city" label="City" type="text" {...register("city")} />{errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1"><FloatingInput id="country" label="Country" type="text" {...register("country")} />{errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}</div>
                <div className="flex flex-col gap-1"><FloatingInput id="zip" label="Postal Code" type="text" {...register("zip")} />{errors.zip && <span className="text-red-500 text-sm">{errors.zip.message}</span>}</div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="default"
                  size="lg"
                  type="button"
                  className="rounded-none uppercase text-on-primary"
                  onClick={() => nextStep("payment-method")}
                >
                  Continue to Payment
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion 3: Payment Method */}
          <AccordionItem value="payment-method" className="border-b border-surface-container pb-2">
            <AccordionTrigger className="font-headline-md text-headline-md text-primary hover:text-tertiary-fixed-dim transition-colors py-4 hover:no-underline">
              3. Payment Method
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
              <div className="flex flex-col gap-1"><FloatingInput id="card" label="Card Number" type="text" {...register("card")} />{errors.card && <span className="text-red-500 text-sm">{errors.card.message}</span>}</div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1"><FloatingInput id="exp" label="Expiration (MM/YY)" type="text" {...register("exp")} />{errors.exp && <span className="text-red-500 text-sm">{errors.exp.message}</span>}</div>
                <div className="flex flex-col gap-1"><FloatingInput id="cvc" label="CVC" type="text" {...register("cvc")} />{errors.cvc && <span className="text-red-500 text-sm">{errors.cvc.message}</span>}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Right Column: Sticky Order Summary */}
      <div className="lg:col-span-5 xl:col-span-4 relative">
        <div className="md:sticky top-32 bg-surface-container-low p-8 rounded-DEFAULT">
          <h2 className="font-headline-md text-headline-md text-primary mb-6">Order Summary</h2>

          <div className="space-y-6 mb-6 pb-6 border-b border-surface-container">
            {cartItems.length === 0 ? (
              <p className="text-secondary font-body-md">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                // Get the first image URL or a placeholder
                const imageUrl = item.product?.product_images?.[0]?.image_url || "/placeholder-image.jpg";

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-surface-dim overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={item.product?.name || "Product Image"}
                        className="w-full h-full object-cover"
                        src={imageUrl}
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="font-headline-md text-[18px] text-primary line-clamp-2">
                          {item.product?.name || "Unknown Product"}
                        </h3>
                        <p className="font-body-md text-secondary text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-body-lg text-primary">
                        ${(item.product?.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Totals */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between font-body-md text-secondary">
              <span>Subtotal</span>
              <span>${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-body-md text-secondary">
              <span>Shipping</span>
              <span>Complimentary</span>
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
          {/* CTA */}
          <Button
            variant="default"
            size="lg"
            type="submit"
            className="w-full rounded-none uppercase text-on-primary flex justify-center items-center gap-2"
            disabled={cartItems.length === 0 || isPlacingOrder}
          >
            <span className="text-surface material-symbols-outlined text-[18px]">
              {isPlacingOrder ? "hourglass_empty" : "lock"}
            </span>
            {isPlacingOrder ? "Placing Order..." : "Place Secure Order"}
          </Button>
        </div>
      </div>
    </form>
  );
}
