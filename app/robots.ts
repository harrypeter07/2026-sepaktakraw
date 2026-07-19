import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/', '/dashboard/', '/api/'],
    },
    sitemap: 'https://maharashtrasepaktakraw.org/sitemap.xml',
  }
}
