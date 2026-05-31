"use client";

import { useTransition } from "react";
import { updateProfile } from "../actions";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";

export function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();

  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const email = user?.email || "";
  const phone = user?.user_metadata?.phone || "";
  const address = user?.user_metadata?.address || "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully!");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput id="fname" name="fname" label="First Name" defaultValue={firstName} />
        <FloatingInput id="lname" name="lname" label="Last Name" defaultValue={lastName} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput id="email" name="email" label="Email Address (Read Only)" defaultValue={email} readOnly className="text-secondary" />
        <FloatingInput id="phone" name="phone" label="Phone Number" type="tel" defaultValue={phone} />
      </div>
      
      <FloatingInput id="address" name="address" label="Address" defaultValue={address} />

      <div className="pt-8 mt-8 border-t border-surface-container">
        <h3 className="font-headline-md text-[18px] text-primary mb-6">Change Password (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput id="password" name="password" label="New Password" type="password" />
          <FloatingInput id="confirmPassword" name="confirmPassword" label="Confirm New Password" type="password" />
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
