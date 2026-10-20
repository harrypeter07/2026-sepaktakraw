import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { DistrictsClient } from '@/components/districts-client'
import districtsData from '@/lib/districts.json'
import recordsData from '@/lib/msta-records.json'

export const revalidate = 86400 // Revalidate once daily

export const metadata: Metadata = {
  title: 'Affiliated District Associations (36 Districts) | Maharashtra Sepaktakraw Association',
  description:
    'Official directory of 36 affiliated district Sepaktakraw associations across Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, and Vidarbha divisions under MSTA. View contacts and medal tallies.',
  alternates: {
    canonical: 'https://mahasepaktakraw.com/districts',
  },
  openGraph: {
    title: '36 Affiliated District Associations | Maharashtra Sepaktakraw',
    description:
      'Explore official district units, regional headquarters, contact emails, and state tournament medal statistics.',
    url: 'https://mahasepaktakraw.com/districts',
    siteName: 'Maharashtra Sepaktakraw Association',
    type: 'website',
  },
}

export default function DistrictsPage() {
  const districtsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Maharashtra Affiliated District Sepaktakraw Associations',
    numberOfItems: districtsData.length,
    itemListElement: districtsData.map((d, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'SportsOrganization',
        name: d.name,
        sport: 'Sepaktakraw',
        location: {
          '@type': 'Place',
          name: `${d.district}, Maharashtra`,
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
        },
        parentOrganization: {
          '@type': 'SportsOrganization',
          name: 'Maharashtra Sepaktakraw Association',
          url: 'https://mahasepaktakraw.com',
        },
      },
    })),
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(districtsSchema) }}
      />
      <Navbar />
      <main className="flex-grow">
        <DistrictsClient districts={districtsData} tallies={recordsData.tallies} />
      </main>
      <Footer />
    </div>
  )
}
