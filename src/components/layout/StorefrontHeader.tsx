import { Header } from "@/components/layout/Header";
import { createClient } from "@/utils/supabase/server";

export async function StorefrontHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (data?.user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    isAdmin = profile?.role === 'admin';
  }

  return <Header user={data?.user} isAdmin={isAdmin} />;
}
