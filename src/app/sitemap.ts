import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere.com';
  
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .is('deleted_at', null);
    
  const { data: categories } = await supabase
    .from('categories')
    .select('name, updated_at')
    .is('deleted_at', null);
    
  const productUrls = (products || []).map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(product.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  const categoryUrls = (categories || []).map((category) => ({
    url: `${baseUrl}/collections?category=${encodeURIComponent(category.name)}`,
    lastModified: new Date(category.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];
  
  return [...staticUrls, ...categoryUrls, ...productUrls];
}
