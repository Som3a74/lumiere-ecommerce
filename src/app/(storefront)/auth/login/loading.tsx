import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="flex-grow w-full max-w-[400px] mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32 flex flex-col items-center">
      <Skeleton className="h-10 w-48 mb-4" />
      <Skeleton className="h-6 w-64 mb-12" />
      
      <div className="w-full space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full mt-8" />
      </div>
      
      <Skeleton className="h-4 w-48 mt-8" />
    </div>
  );
}
