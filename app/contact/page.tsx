import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ContactClient } from '@/components/contact-client'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Contact Us & Association Secretariat | Maharashtra Sepaktakraw Association',
  description:
    'Contact the Maharashtra Sepaktakraw Association (MSTA) headquarters at Nagpur. Inquire about team registrations, district affiliations, tournament scheduling, or state trials.',
  alternates: {
    canonical: 'https://sepaktakrawmaharashtra.in/contact',
  },
  openGraph: {
    title: 'Contact Maharashtra Sepaktakraw Association',
    description:
      'Official contact information, email, office hours, and inquiry form for Maharashtra Sepaktakraw Association.',
    url: 'https://sepaktakrawmaharashtra.in/contact',
    siteName: 'Maharashtra Sepaktakraw Association',
    type: 'website',
  },
}

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Maharashtra Sepaktakraw Association',
    url: 'https://sepaktakrawmaharashtra.in/contact',
    mainEntity: {
      '@type': 'SportsOrganization',
      name: 'Maharashtra Sepaktakraw Association',
      sport: 'Sepaktakraw',
      telephone: '+91 98224 64555',
      email: 'contact@sepaktakrawmaharashtra.in',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Navbar />
      <ContactClient />
      <Footer />
    </div>
  )
}
