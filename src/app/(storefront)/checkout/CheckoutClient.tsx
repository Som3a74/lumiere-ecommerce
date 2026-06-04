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
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { applyCoupon, removeCoupon } from "@/app/actions/coupons";
import { useTransition } from "react";

// Initialize Stripe outside of component to avoid recreating the object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface CheckoutClientProps {
  userProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
  };
  cartItems: any[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  clientSecret: string;
  coupon: any | null;
}

function CheckoutForm({ userProfile, cartItems, totals, coupon }: Omit<CheckoutClientProps, "clientSecret">) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [openAccordion, setOpenAccordion] = useState<string>("contact-info");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isPending, startTransition] = useTransition();
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

  // Omit card, exp, cvc from schema validation since Stripe Elements handles them
  const formOptions = {
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: userProfile.email || "",
      phone: userProfile.phone || "",
      fname: userProfile.firstName || "",
      lname: userProfile.lastName || "",
      address: userProfile.address || "",
      city: "",
      country: "",
      postalCode: "",
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm(formOptions);

  const nextStep = (id: string) => {
    setOpenAccordion(id);
  };

  const onSubmit = async (data: any) => {
    if (!stripe || !elements) {
      return;
    }

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
      postalCode: data.postalCode,
    };

    // 1. Confirm Payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: `${data.fname} ${data.lname}`,
            email: data.email,
            phone: data.phone,
            address: {
              line1: data.address,
              city: data.city,
              country: data.country,
              postal_code: data.postalCode,
            }
          }
        }
      },
      redirect: "if_required", // We will handle the redirect manually if it succeeds immediately
    });

    if (stripeError) {
      toast.error(stripeError.message || "An error occurred during payment.");
      setIsPlacingOrder(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      // 2. Place Order in our Database
      const paymentInfo = {
        id: paymentIntent.id,
        method: paymentIntent.payment_method,
        status: paymentIntent.status,
      };

      const result = await placeOrder(cartItems, totals, contactInfo, shippingAddress, paymentInfo, coupon?.id);

      setIsPlacingOrder(false);

      if (result.success) {
        toast.success(result.message);
        router.push("/my-account");
      } else {
        toast.error(result.message);
      }
    } else {
      // Payment might require further action (e.g. 3D Secure), which is handled by Stripe redirect
      setIsPlacingOrder(false);
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
                <div className="flex flex-col gap-1"><FloatingInput id="email" label="Email Address" type="email" {...register("email")} />{errors.email && <span className="text-red-500 text-sm">{errors.email?.message as string}</span>}</div>
                <div className="flex flex-col gap-1"><FloatingInput id="phone" label="Phone Number" type="tel" {...register("phone")} />{errors.phone && <span className="text-red-500 text-sm">{errors.phone?.message as string}</span>}</div>
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
                <div className="flex flex-col gap-1"><FloatingInput id="fname" label="First Name" type="text" {...register("fname")} />{errors.fname && <span className="text-red-500 text-sm">{errors.fname?.message as string}</span>}</div>
                <div className="flex flex-col gap-1"><FloatingInput id="lname" label="Last Name" type="text" {...register("lname")} />{errors.lname && <span className="text-red-500 text-sm">{errors.lname?.message as string}</span>}</div>
              </div>
              <div className="flex flex-col gap-1"><FloatingInput id="address" label="Street Address" type="text" {...register("address")} />{errors.address && <span className="text-red-500 text-sm">{errors.address?.message as string}</span>}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1 md:col-span-1"><FloatingInput id="city" label="City" type="text" {...register("city")} />{errors.city && <span className="text-red-500 text-sm">{errors.city?.message as string}</span>}</div>
                <div className="flex flex-col gap-1 md:col-span-1"><FloatingInput id="country" label="Country (e.g. US)" type="text" maxLength={2} {...register("country")} />{errors.country && <span className="text-red-500 text-sm">{errors.country?.message as string}</span>}</div>
                <div className="flex flex-col gap-1 md:col-span-1"><FloatingInput id="postalCode" label="Postal Code" type="text" {...register("postalCode")} />{errors.postalCode && <span className="text-red-500 text-sm">{errors.postalCode?.message as string}</span>}</div>
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
            <AccordionContent className="pt-4 space-y-6 min-h-[250px]">
              <PaymentElement
                options={{
                  layout: "tabs",
                  fields: {
                    billingDetails: {
                      name: 'never',
                      email: 'never',
                      phone: 'never',
                      address: {
                        country: 'never',
                        postalCode: 'never'
                      }
                    }
                  }
                }}
              />
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
                let matchingImages = item.product?.product_images || [];
                if (item.color_id) {
                  const colorImages = matchingImages.filter((img: any) => img.color_id === item.color_id);
                  if (colorImages.length > 0) matchingImages = colorImages;
                }
                
                const imageUrl = matchingImages[0]?.image_url || "/placeholder-image.jpg";

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
                        {(item.color || item.size) && (
                          <p className="font-body-md text-secondary text-sm mt-1">
                            {item.color}{item.color && item.size ? " / " : ""}{item.size}
                          </p>
                        )}
                        <p className="font-body-md text-secondary text-sm mt-1">Qty: {item.quantity}</p>
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
            {totals.discount > 0 && (
              <div className="flex justify-between font-body-md text-secondary">
                <span>Discount ({coupon?.code})</span>
                <span className="text-primary">- ${totals.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
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
                  type="button"
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
                  type="button"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
            )}
          </div>

          {/* CTA */}
          <Button
            variant="default"
            size="lg"
            type="submit"
            className="w-full rounded-none uppercase text-on-primary flex justify-center items-center gap-2"
            disabled={cartItems.length === 0 || isPlacingOrder || !stripe || !elements || openAccordion !== "payment-method"}
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

export default function CheckoutClient({ userProfile, cartItems, totals, clientSecret, coupon }: CheckoutClientProps) {
  if (!clientSecret) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-primary font-body-md">Initializing secure checkout...</div>
      </div>
    );
  }

  const appearance = {
    theme: 'flat' as const,
    variables: {
      fontFamily: 'Inter, sans-serif',
      fontLineHeight: '1.5',
      borderRadius: '0px',
      colorBackground: '#f9f9f9',
      colorPrimaryText: '#1a1c1c',
      colorText: '#444748',
      colorTextPlaceholder: '#747878',
      colorDanger: '#ba1a1a',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: 'none',
        borderBottom: '1px solid #747878',
        boxShadow: 'none',
        backgroundColor: 'transparent',
      },
      '.Input:focus': {
        borderBottom: '2px solid #1a1c1c',
        boxShadow: 'none',
      },
      '.Label': {
        color: '#444748',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '12px',
        fontWeight: '600',
      }
    }
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm userProfile={userProfile} cartItems={cartItems} totals={totals} coupon={coupon} />
    </Elements>
  );
}
