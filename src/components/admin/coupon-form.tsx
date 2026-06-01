"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveCoupon } from "@/app/actions/admin-coupons";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  discount_percentage: z.coerce.number().min(1).max(100),
  expiration_date: z.string().optional(),
  is_active: z.string(),
});

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  expiration_date: string | null;
  is_active: boolean;
}

interface CouponFormProps {
  coupon?: Coupon;
}

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      code: coupon?.code || "",
      discount_percentage: coupon?.discount_percentage || 10,
      expiration_date: coupon?.expiration_date ? new Date(coupon.expiration_date).toISOString().split('T')[0] : "",
      is_active: coupon?.is_active === false ? "false" : "true",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("code", values.code);
        formData.append("discount_percentage", values.discount_percentage.toString());
        if (values.expiration_date) {
          formData.append("expiration_date", values.expiration_date);
        }
        formData.append("is_active", values.is_active);
        
        const newId = await saveCoupon(formData, coupon?.id);
        toast.success(coupon ? "Coupon updated successfully" : "Coupon created successfully");
        
        if (!coupon) {
          router.push(`/admin/coupons/${newId}/edit`);
        } else {
          router.refresh();
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to save coupon");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface p-8 border border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Coupon Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. SUMMER20" className="rounded-none uppercase focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discount_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Discount (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="20" className="rounded-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiration_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Expiration Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-none focus-visible:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-widest text-on-surface-variant">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-none focus-visible:ring-primary">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {coupon ? "Save Changes" : "Create Coupon"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
