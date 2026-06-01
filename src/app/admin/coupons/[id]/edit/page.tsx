import { createClient } from "@/utils/supabase/server";
import { CouponForm } from "@/components/admin/coupon-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !coupon) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons" className="text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Edit Coupon</h1>
          <p className="mt-2 text-on-surface-variant">{coupon.code}</p>
        </div>
      </div>

      <CouponForm coupon={coupon} />
    </div>
  );
}
