import { MetadataRoute } from 'next'
import districtsData from '@/lib/districts.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://maharashtrasepaktakraw.org'
  
  const staticRoutes = [
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

  const staticEntries = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  const districtEntries = districtsData.map(d => ({
    url: `${baseUrl}/districts/${d.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...districtEntries]
}
