import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { AboutClient } from '@/components/about-client'

export const revalidate = 86400 // Revalidate daily

export const metadata: Metadata = {
  title: 'About Us, Governance & Affiliations | Maharashtra Sepaktakraw Association',
  description:
    'Apex governing body for Sepaktakraw in Maharashtra. Registered public society Reg.No. MAHARASHTRA/910/98 (Nagpur). Affiliated with Sepaktakraw Federation of India (STFI) and Maharashtra Olympic Association (MOA).',
  alternates: {
    canonical: 'https://mahasepaktakraw.com/about',
  },
  openGraph: {
    title: 'About Maharashtra Sepaktakraw Association (MSTA)',
    description:
      'History, leadership, official affiliations, rules, and technical commission of Maharashtra Sepaktakraw Association.',
    url: 'https://mahasepaktakraw.com/about',
    siteName: 'Maharashtra Sepaktakraw Association',
    type: 'website',
  },
}

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Maharashtra Sepaktakraw Association',
    url: 'https://mahasepaktakraw.com/about',
    mainEntity: {
      '@type': 'SportsOrganization',
      name: 'Maharashtra Sepaktakraw Association',
      legalName: 'Maharashtra Sepaktakraw Association (Reg. No. MAHARASHTRA/910/98)',
      sport: 'Sepaktakraw',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      parentOrganization: {
        '@type': 'SportsOrganization',
        name: 'Sepaktakraw Federation of India',
        url: 'https://sepaktakrawindia.in',
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Navbar />
      <AboutClient />
      <Footer />
    </div>
  )
}
