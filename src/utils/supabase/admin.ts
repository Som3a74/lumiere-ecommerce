import { createClient } from "@supabase/supabase-js";

// Note: This client uses the service role key and bypasses RLS.
// It should ONLY be used in secure server actions or API routes, NEVER on the client.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
