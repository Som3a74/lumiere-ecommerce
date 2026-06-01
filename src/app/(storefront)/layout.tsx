import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (data?.user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    isAdmin = profile?.role === 'admin';
  }

  return (
    <>
      <Header user={data?.user} isAdmin={isAdmin} />
      <main className="flex-1 mt-24">{children}</main>
      <Footer />
    </>
  );
}
