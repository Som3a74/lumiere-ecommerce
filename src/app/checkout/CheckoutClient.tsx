"use client";

import { useState } from "react";
import Image from "next/image";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
  const [openAccordion, setOpenAccordion] = useState<string>("contact-info");

  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const isFormValid = Object.values(formData).every(val => val.trim() !== "");

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? "" : id);
  };

  const nextStep = (id: string) => {
    setOpenAccordion(id);
  };

  const handlePlaceOrder = () => {
    if (!isFormValid) {
      toast.error("Please fill in all contact, shipping, and payment information before placing your order.");
      return;
    }
    // Placeholder action for placing an order
    toast.success("Order placed successfully! We will email you the receipt.");
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
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
                <FloatingInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} />
                <FloatingInput id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end">
                <Button
                  className="rounded-none px-8 py-6 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary-fixed-dim hover:text-primary transition-colors"
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
                <FloatingInput id="fname" label="First Name" type="text" value={formData.fname} onChange={handleInputChange} />
                <FloatingInput id="lname" label="Last Name" type="text" value={formData.lname} onChange={handleInputChange} />
              </div>
              <FloatingInput id="address" label="Address" type="text" value={formData.address} onChange={handleInputChange} />
              <FloatingInput id="city" label="City" type="text" value={formData.city} onChange={handleInputChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingInput id="country" label="Country" type="text" value={formData.country} onChange={handleInputChange} />
                <FloatingInput id="zip" label="Postal Code" type="text" value={formData.zip} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end">
                <Button
                  className="rounded-none px-8 py-6 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary-fixed-dim hover:text-primary transition-colors"
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
              <FloatingInput id="card" label="Card Number" type="text" value={formData.card} onChange={handleInputChange} />
              <div className="grid grid-cols-2 gap-6">
                <FloatingInput id="exp" label="Expiration (MM/YY)" type="text" value={formData.exp} onChange={handleInputChange} />
                <FloatingInput id="cvc" label="CVC" type="text" value={formData.cvc} onChange={handleInputChange} />
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
            className="w-full rounded-none py-6 font-label-caps text-label-caps uppercase tracking-widest flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            disabled={cartItems.length === 0}
            onClick={handlePlaceOrder}
          >
            <span className="text-surface material-symbols-outlined text-[18px]">lock</span>
            Place Secure Order
          </Button>
        </div>
      </div>
    </div>
  );
}
