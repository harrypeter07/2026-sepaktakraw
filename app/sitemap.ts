import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://maharashtrasepaktakraw.org'
  
  const routes = [
    '',
    '/about',
    '/tournaments',
    '/teams',
    '/players',
    '/districts',
    '/news',
    '/contact',
    '/privacy',
    '/terms',
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}
