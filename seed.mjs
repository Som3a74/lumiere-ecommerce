import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://xtthwsdnpodjzfmnfxkj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I1AsQRtI4HddnWCajxjkwQ__43tbJJl'; // Anon key from .env.local

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const mockProducts = [
  {
    title: "L'Éclipse Noire",
    price: 12500,
    category: "Chronograph",
    description: "A timeless chronograph.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMVCkQdrMQKEtYKoVEQY1NcOCRLxp_lP8k-TdcTs0xfubdKOGRFCChJDKzKeMzMicT2JbSsRekCnviLzgvz4FC7krn27v6I0XQOI2CY5x51BRDQfuDlc5XX93dnxWwre-Ntu48-xT1rryXllCOocmHWEkDrAWsFPrztKjL4EyuaIyu8-fBObEUImsLG0UdzFPSr-5rAS0NTYNSeZ_SCiBtT70lgSWnlPQoisa97iSDRBPFQNg3j87h5A5T0Y0CuiMfRlBUEhxybvcJ",
  },
  {
    title: "Aura Classique",
    price: 8900,
    category: "Automatic",
    description: "An elegant automatic piece.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtvkWmW82FxFtu1EF8IS8lrrfbSO-_L3czoQS4u3cQ8NU2es9js6jgDC2dvjNxtOGp3_AGlH3l_lYLHtqsGcs145i05kphyCud-xwKD0Km2xjgOA6Y3ibpCWKPRxWeGNDWVnR6ECFXizfgyQfLl2zgYjoNRxleW0tFiKIKpbKYYWWQ95RQ_anPv8w4faxkNY0YRESzJDgRaGpdE0r1zpXbQ_NLOGCGITv1euTaSX5NDuI_QuVZTsCPjRob8Si3ryS1NDh3xC5UiZVq",
  },
  {
    title: "Héritage 1924",
    price: 15200,
    category: "Heritage",
    description: "A heritage masterpiece.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT4-tnzcom2uEA_Fel996Z7xUHkHGuzw7jINgsH4e7yLK3dmz2Rd3QNwvcCG-ohKB2hMmLhZkXkvIcqgS4UJ-hGAzbadzzp8glxBCJt48gjOhWZaG-GdBoehWPnm1aOcnsuV5iN7i16OkCYMKzHyyj7uL-PXzgwDaFK8Ma98ZFbTfuB6PBG4_s_mwZD-G-t4atTYeYnve3Q2NKLZzqDO1K1_3ep5Ypm9T-js_ArRCwaSYDWEef6NdRxTDk-Ne8_8dCMty-P8H7GejA",
  },
  {
    title: "Squelette Moderne",
    price: 42000,
    category: "Tourbillon",
    description: "A modern tourbillon skeleton.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDltgmX-G_rzdOdHLK466xAHMV8NYOK548aAckZGe9lhYOx_HC8SUKnfFsy-L2wbCLU1MRxJwLrsdcwLPlWMJXick71s9FRYxyeZX7wxFD-zK1OoqN6YWKnE4KKF93DquXodzWkTZg27EW2uCelEiCplSai27z9Y7AgRiPet8BiRyEWQbg2IexSm6nctlc4hNq4AskFkJHkCMRfFBZI01-c6y7M_8pk2JIzJsRy0n-E_wYXvIy_aZp4mfBuy8Cl02Wv2koMgWQtkHMy",
  },
  {
    title: "Sac de Nuit",
    price: 3800,
    category: "Leather Goods",
    description: "A beautiful leather night bag.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtwzKWoNQXq3jedMqQ5lvE0lUCipf-SzjWkAogLwqWNtUWgsTjhGcCcvr7tBiDtWE4wsetKUf5mrplXJEFowVp26UHKTU0W1fcH-gIPpzq_FtaNHTsc4fKz5_CwC8AjF8iQlCaE7OHgZo8Zkg9rslIpy9UUJ52q7i0pVfqnjA44cnQMDysk3JlzYTmP3y-4_iS-Qp2N8zj-4PpXq9PkKfXTq4e3FM-IOH0N8DIxpINtUrrQ47ULJdFjFH5k91EKyU0F0qpabfxGX_n",
  },
  {
    title: "Le Grand Voyage",
    price: 2950,
    category: "Tote",
    description: "The grand voyage tote.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGnSPJc7GHjvok3m9TjhCu1X8OP3mO5AxM8Nh6r8J2NXoy4becqr6cZyYVsTDd74bFPm12aRlxwL-eJSlNyUewj3AmKG5BKmA31wvgPo9jXcYVq-WabNchjWFsX_1b9h2GFNh-kbqPgKvRMHTPy7E7TC8qlpa_PnguJS4I0hvxbw8ZtKVLVozn6HAYnW08RMuN-93Lhq2OknoFiSLkI7-C52mVlj8nuo_Cfko4wjYoVWAdczfgs85Lv9Lj2mWjzBgr-brCXq7Fcksc",
  }
];

async function run() {
  let sqlCommands = ``;
  sqlCommands += `DELETE FROM public.products; \n`;
  sqlCommands += `DELETE FROM public.product_images; \n`;

  for (let i = 0; i < mockProducts.length; i++) {
    const product = mockProducts[i];
    console.log(`Processing ${product.title}...`);
    
    // Download image
    const response = await fetch(product.imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Supabase Storage
    const fileName = `${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('product_images')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
      });
      
    if (error) {
      console.error(`Error uploading ${fileName}:`, error);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product_images')
      .getPublicUrl(fileName);

    console.log(`Uploaded to ${publicUrl}`);

    // Generate SQL for Products
    const productId = `gen_random_uuid()`;
    sqlCommands += `
      WITH inserted_product AS (
        INSERT INTO public.products (name, description, price, category, stock)
        VALUES ('${product.title.replace(/'/g, "''")}', '${product.description}', ${product.price}, '${product.category}', 10)
        RETURNING id
      )
      INSERT INTO public.product_images (product_id, image_url, is_thumbnail, display_order)
      SELECT id, '${publicUrl}', true, 0 FROM inserted_product;
    `;
  }

  fs.writeFileSync('seed_data.sql', sqlCommands);
  console.log('SQL generated in seed_data.sql');
}

run();
