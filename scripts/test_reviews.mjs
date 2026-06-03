import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtthwsdnpodjzfmnfxkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dGh3c2RucG9kanpmbW5meGtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA4ODcxNSwiZXhwIjoyMDk1NjY0NzE1fQ.3enjGLfiALk7SY8qgCTBryIMmv2Y237w66iKdpWGQ48';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('reviews').select('*').limit(1);
  console.log('Data:', data);
  console.log('Error:', error);
}

main();
