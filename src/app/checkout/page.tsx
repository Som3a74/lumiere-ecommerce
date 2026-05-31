"use client";

import { useState } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const [openAccordion, setOpenAccordion] = useState<string>("contact-info");

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? "" : id);
  };

  const nextStep = (id: string) => {
    setOpenAccordion(id);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <style jsx>{`
        .accordion-content {
          transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
          overflow: hidden;
        }
      `}</style>
      
      {/* Left Column: Checkout Steps */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-8">
        <div className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-surface-container pb-4">
          Secure Checkout
        </div>

        {/* Accordion 1: Contact Info */}
        <div className="border-b border-surface-container pb-6">
          <button
            className="w-full flex justify-between items-center py-4 text-left group"
            onClick={() => toggleAccordion("contact-info")}
          >
            <span className="font-headline-md text-headline-md text-primary group-hover:text-tertiary-fixed-dim transition-colors">
              1. Contact Information
            </span>
            <span className="material-symbols-outlined text-secondary">
              {openAccordion === "contact-info" ? "expand_less" : "expand_more"}
            </span>
          </button>
          <div
            className={`accordion-content pt-4 space-y-6 ${openAccordion === "contact-info" ? "opacity-100" : "opacity-0"}`}
            style={{ maxHeight: openAccordion === "contact-info" ? "1000px" : "0" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                  id="email"
                  placeholder="Email Address"
                  type="email"
                />
                <label
                  className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                  htmlFor="email"
                >
                  Email Address
                </label>
              </div>
              <div className="relative">
                <input
                  className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                  id="phone"
                  placeholder="Phone Number"
                  type="tel"
                />
                <label
                  className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary-fixed-dim hover:text-primary transition-colors"
                onClick={() => nextStep("shipping-address")}
              >
                Continue to Shipping
              </button>
            </div>
          </div>
        </div>

        {/* Accordion 2: Shipping Address */}
        <div className="border-b border-surface-container pb-6">
          <button
            className="w-full flex justify-between items-center py-4 text-left group"
            onClick={() => toggleAccordion("shipping-address")}
          >
            <span className="font-headline-md text-headline-md text-primary group-hover:text-tertiary-fixed-dim transition-colors">
              2. Shipping Address
            </span>
            <span className="material-symbols-outlined text-secondary">
              {openAccordion === "shipping-address" ? "expand_less" : "expand_more"}
            </span>
          </button>
          <div
            className={`accordion-content pt-4 space-y-6 ${openAccordion === "shipping-address" ? "opacity-100" : "opacity-0"}`}
            style={{ maxHeight: openAccordion === "shipping-address" ? "1000px" : "0" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                  id="fname"
                  placeholder="First Name"
                  type="text"
                />
                <label
                  className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                  htmlFor="fname"
                >
                  First Name
                </label>
              </div>
              <div className="relative">
                <input
                  className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                  id="lname"
                  placeholder="Last Name"
                  type="text"
                />
                <label
                  className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                  htmlFor="lname"
                >
                  Last Name
                </label>
              </div>
            </div>
            <div className="relative">
              <input
                className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                id="address"
                placeholder="Address"
                type="text"
              />
              <label
                className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                htmlFor="address"
              >
                Address
              </label>
            </div>
            <div className="relative">
              <input
                className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                id="city"
                placeholder="City"
                type="text"
              />
              <label
                className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                htmlFor="city"
              >
                City
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                  id="country"
                  placeholder="Country"
                  type="text"
                />
                <label
                  className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                  htmlFor="country"
                >
                  Country
                </label>
              </div>
              <div className="relative">
                <input
                  className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                  id="zip"
                  placeholder="Postal Code"
                  type="text"
                />
                <label
                  className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                  htmlFor="zip"
                >
                  Postal Code
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary-fixed-dim hover:text-primary transition-colors"
                onClick={() => nextStep("payment-method")}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        {/* Accordion 3: Payment Method */}
        <div className="border-b border-surface-container pb-6">
          <button
            className="w-full flex justify-between items-center py-4 text-left group"
            onClick={() => toggleAccordion("payment-method")}
          >
            <span className="font-headline-md text-headline-md text-primary group-hover:text-tertiary-fixed-dim transition-colors">
              3. Payment Method
            </span>
            <span className="material-symbols-outlined text-secondary">
              {openAccordion === "payment-method" ? "expand_less" : "expand_more"}
            </span>
          </button>
          <div
            className={`accordion-content pt-4 space-y-6 ${openAccordion === "payment-method" ? "opacity-100" : "opacity-0"}`}
            style={{ maxHeight: openAccordion === "payment-method" ? "1000px" : "0" }}
          >
            <div className="relative">
              <input
                className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                id="card"
                placeholder="Card Number"
                type="text"
              />
              <label
                className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                htmlFor="card"
              >
                Card Number
              </label>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <input
                  className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                  id="exp"
                  placeholder="MM/YY"
                  type="text"
                />
                <label
                  className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                  htmlFor="exp"
                >
                  Expiration
                </label>
              </div>
              <div className="relative">
                <input
                  className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                  id="cvc"
                  placeholder="CVC"
                  type="text"
                />
                <label
                  className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                  htmlFor="cvc"
                >
                  CVC
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Order Summary */}
      <div className="lg:col-span-5 xl:col-span-4 relative">
        <div className="md:sticky top-32 bg-surface-container-low p-8 rounded-DEFAULT">
          <h2 className="font-headline-md text-headline-md text-primary mb-6">Order Summary</h2>
          {/* Item Preview */}
          <div className="flex gap-4 mb-6 pb-6 border-b border-surface-container">
            <div className="w-24 h-24 bg-surface-dim overflow-hidden flex-shrink-0">
              <img
                alt="Minimalist Watch"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1r4_6ZgUiecq7H_lq3jeOhA30OZK6T2EgTlwuhPjmqUkzEKYeGPqa_IsooyTFKxdpfDVbkFsPYjGOLRvySKwt8-TMU3UiPv6ZKKlO5o9-2dWKHmlmmZttqB2dAuUbsL_j_xfcBYleNgzEjyJhw8M_-xEGyE2k0rMLol6rMrMolhj-MmqLTF7ShE-FEPgdeGXKE5CsbT5Lxo_7hcI0Kba1TNk32GY_dKspRCE1C54i5xmthUX5cHSAyCD6AAv6rmrfm1SHsW6cV0tP"
              />
            </div>
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="font-headline-md text-[18px] text-primary">Le Chronographe Minimal</h3>
                <p className="font-body-md text-secondary text-sm">Noir / Argent</p>
              </div>
              <div className="font-body-lg text-primary">$4,500.00</div>
            </div>
          </div>
          {/* Totals */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between font-body-md text-secondary">
              <span>Subtotal</span>
              <span>$4,500.00</span>
            </div>
            <div className="flex justify-between font-body-md text-secondary">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between font-body-md text-secondary">
              <span>Estimated Tax</span>
              <span>$360.00</span>
            </div>
            <div className="flex justify-between font-headline-md text-primary pt-4 border-t border-surface-container">
              <span>Total</span>
              <span>$4,860.00</span>
            </div>
          </div>
          {/* CTA */}
          <button className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary-fixed-dim hover:text-primary transition-colors flex justify-center items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Place Secure Order
          </button>
        </div>
      </div>
    </div>
  );
}
