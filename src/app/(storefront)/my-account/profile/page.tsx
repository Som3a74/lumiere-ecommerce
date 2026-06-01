import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "./ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      <section className="mb-16">
        <h2 className="font-headline-md text-headline-md text-primary mb-8 border-b border-surface-container pb-4">
          Personal Information
        </h2>
        <ProfileForm user={user} />
      </section>
    </>
  );
}
