import pg from 'pg';

const connectionString = "postgresql://postgres:112002Ahmedsom3a%23@db.xtthwsdnpodjzfmnfxkj.supabase.co:5432/postgres";

const pool = new pg.Pool({
  connectionString,
});

async function main() {
  try {
    const result = await pool.query(`
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  product_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can insert reviews." ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can delete reviews." ON public.reviews FOR DELETE USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
    `);
    console.log("Migration successful");
  } catch (err) {
    console.error("Migration failed", err);
  } finally {
    await pool.end();
  }
}

main();
