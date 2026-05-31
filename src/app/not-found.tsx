import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop text-center">
      <div className="space-y-6 max-w-lg">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-widest">
          404
        </h1>
        <h2 className="font-headline-md text-headline-md text-secondary uppercase tracking-widest">
          Page Not Found
        </h2>
        <p className="font-body-lg text-body-lg text-secondary leading-relaxed">
          The page you are looking for does not exist or has been moved. 
          Discover our latest collections or return to the homepage.
        </p>
        <div className="pt-8">
          <Button asChild variant="default" size="lg" className="rounded-none uppercase text-on-primary">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
