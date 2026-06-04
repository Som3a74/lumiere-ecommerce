"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="font-headline-lg text-display-lg text-primary mb-4">
        Something went wrong
      </h2>
      <p className="font-body-md text-secondary max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error occurred while processing your request. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={() => reset()}
          className="uppercase tracking-widest rounded-none"
        >
          Try Again
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="uppercase tracking-widest rounded-none"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
