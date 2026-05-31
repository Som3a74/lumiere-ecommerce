import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xtthwsdnpodjzfmnfxkj.supabase.co'
const supabaseKey = 'sb_publishable_I1AsQRtI4HddnWCajxjkwQ__43tbJJl' // Need service role or sql for pg_policies? 
// Wait, we can't query pg_policies using anon key because of permissions.

// I'll just drop the problematic policy using postgres connection string or node-postgres if I have one.
// Let's check the env variables or see if I can find the connection string.
