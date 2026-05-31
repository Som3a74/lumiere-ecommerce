import { createClient } from "@/utils/supabase/server";
import { MyAccountSidebar } from "./MyAccountSidebar";

export default async function MyAccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  
  // Create a display name (fallback to "Guest" if none exists)
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Guest";

  return (
    <div className="pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      <div className="mb-16 text-center md:text-left">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Account Dashboard
        </h1>
        <p className="font-body-lg text-body-lg text-secondary">Welcome back, {displayName}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Sidebar Navigation */}
        <MyAccountSidebar />

        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-9 space-y-24">
          {children}
        </div>
      </div>
    </div>
  );
}
