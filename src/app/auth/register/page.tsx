"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "../actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-[80px] py-[80px] md:py-[128px]">
      <div className="flex flex-col gap-12 max-w-[500px] mx-auto">
        <div className="text-center flex flex-col gap-4">
          <h1 className="font-heading text-[32px] md:text-[40px] leading-[40px] md:leading-[48px]">
            Create Account
          </h1>
          <p className="font-sans text-[16px] leading-[24px] text-muted-foreground">
            Join LUMIÈRE to unlock exclusive access to our bespoke services and private collections.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-sm font-sans text-sm border border-red-100">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input type="text" name="firstName" placeholder="FIRST NAME" required />
            <Input type="text" name="lastName" placeholder="LAST NAME" required />
          </div>
          <Input type="email" name="email" placeholder="EMAIL ADDRESS" required />
          <Input type="password" name="password" placeholder="PASSWORD" required />

          <Button type="submit" variant="default" size="lg" className="w-full rounded-none uppercase text-on-primary mt-4" disabled={isPending}>
            {isPending ? "Creating Account..." : "Register"}
          </Button>
        </form>

        <div className="text-center pt-8 border-t border-border mt-8">
          <p className="font-sans text-[14px] text-muted-foreground">
            Already have an account? <Link href="/auth/login" className="text-primary hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
