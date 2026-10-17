import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sepaktakrawmaharashtra.in'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/', '/dashboard/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
