import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LUMIÈRE GENÈVE',
    short_name: 'LUMIÈRE',
    description: 'The Art of Quiet Luxury. Precision engineering meets timeless elegance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9f9f9',
    theme_color: '#1a1c1c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
