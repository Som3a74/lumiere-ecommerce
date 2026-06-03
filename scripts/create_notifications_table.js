const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:112002Ahmedsom3a%23@db.xtthwsdnpodjzfmnfxkj.supabase.co:5432/postgres'
});

async function main() {
  await client.connect();
  console.log("Connected to database");

  const sql = `
    CREATE TABLE IF NOT EXISTS public.user_notifications (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      user_id uuid,
      title text NOT NULL,
      message text NOT NULL,
      is_read boolean DEFAULT false,
      created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
      CONSTRAINT user_notifications_pkey PRIMARY KEY (id),
      CONSTRAINT user_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );
  `;
  await client.query(sql);
  console.log("Table created");
  
  // also allow public read/write access if RLS is enabled, or disable RLS for now just for admin/user
  // actually let's enable RLS and add a policy
  const rlsSql = `
    ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view their own notifications" ON public.user_notifications;
    CREATE POLICY "Users can view their own notifications" ON public.user_notifications
      FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can update their own notifications" ON public.user_notifications;
    CREATE POLICY "Users can update their own notifications" ON public.user_notifications
      FOR UPDATE
      USING (auth.uid() = user_id);
  `;
  await client.query(rlsSql);
  console.log("RLS enabled");

  await client.end();
}

main().catch(console.error);
