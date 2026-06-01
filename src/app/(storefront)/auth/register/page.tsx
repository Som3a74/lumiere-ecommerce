"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "../actions";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    setError(null);
    startTransition(async () => {
      const result = await signup(data);
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-sm font-sans text-sm border border-red-100">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Input type="text" placeholder="FIRST NAME" {...register("firstName")} />
              {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <Input type="text" placeholder="LAST NAME" {...register("lastName")} />
              {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Input type="email" placeholder="EMAIL ADDRESS" {...register("email")} />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <Input type="password" placeholder="PASSWORD" {...register("password")} />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>

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
