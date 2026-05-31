"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer",
            className
          )}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary pointer-events-none"
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
