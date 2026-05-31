import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xtthwsdnpodjzfmnfxkj.supabase.co'
const supabaseKey = 'sb_publishable_I1AsQRtI4HddnWCajxjkwQ__43tbJJl'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      product_images (
        image_url
      )
    `)
  console.log('Error:', error)
  console.log('Data:', JSON.stringify(data, null, 2))
}

test()
