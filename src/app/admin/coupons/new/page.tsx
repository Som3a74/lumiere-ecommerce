import { CouponForm } from "@/components/admin/coupon-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCouponPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons" className="text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">New Coupon</h1>
          <p className="mt-2 text-on-surface-variant">Create a discount code for customers.</p>
        </div>
      </div>

      <CouponForm />
    </div>
  );
}
