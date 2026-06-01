"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "../actions";
import { profileSchema, ProfileInput } from "@/lib/validations/profile";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";

export function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();

  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const email = user?.email || "";
  const phone = user?.user_metadata?.phone || "";
  const address = user?.user_metadata?.address || "";

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fname: firstName,
      lname: lastName,
      email: email,
      phone: phone,
      address: address,
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (data: ProfileInput) => {
    startTransition(async () => {
      const result = await updateProfile(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully!");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1"><FloatingInput id="fname" label="First Name" {...register("fname")} />{errors.fname && <span className="text-red-500 text-sm">{errors.fname.message}</span>}</div>
        <div className="flex flex-col gap-1"><FloatingInput id="lname" label="Last Name" {...register("lname")} />{errors.lname && <span className="text-red-500 text-sm">{errors.lname.message}</span>}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1"><FloatingInput id="email" label="Email Address (Read Only)" readOnly className="text-secondary" {...register("email")} />{errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}</div>
        <div className="flex flex-col gap-1"><FloatingInput id="phone" label="Phone Number" type="tel" {...register("phone")} />{errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}</div>
      </div>
      
      <div className="flex flex-col gap-1"><FloatingInput id="address" label="Address" {...register("address")} />{errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}</div>

      <div className="pt-8 mt-8 border-t border-surface-container">
        <h3 className="font-headline-md text-[18px] text-primary mb-6">Change Password (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1"><FloatingInput id="password" label="New Password" type="password" {...register("password")} />{errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}</div>
          <div className="flex flex-col gap-1"><FloatingInput id="confirmPassword" label="Confirm New Password" type="password" {...register("confirmPassword")} />{errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}</div>
        </div>
        <p className="font-body-sm text-secondary mt-2">Leave blank if you do not wish to change your password.</p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary-fixed-dim hover:text-primary transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
