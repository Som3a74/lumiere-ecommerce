import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-none border border-surface-container bg-transparent px-4 py-2 font-body-md text-primary transition-colors file:border-0 file:bg-transparent file:font-label-caps file:text-secondary placeholder:text-secondary focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
