import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://maharashtrasepaktakraw.org'),
  title: {
    default: 'Maharashtra Sepak Takraw Association (MSTA) | Official Portal',
    template: '%s | Maharashtra Sepak Takraw Association (MSTA)',
  },
  description:
    'Official website of the Maharashtra Sepak Takraw Association (MSTA). Reg. No. MAHARASHTRA/910/98 (Nagpur). Affiliated with Sepaktakraw Federation of India (STFI) & recognized by Maharashtra Olympic Association. Discover teams, verified URN athletes, state tournaments, and 36 district units.',
  keywords: [
    'Sepak Takraw',
    'Maharashtra Sepak Takraw Association',
    'MSTA',
    'Sepaktakraw Maharashtra',
    'Kick Volleyball India',
    'Sepak Takraw Federation of India',
    'STFI',
    'MSTA Tournaments',
    'MSTA Teams',
    'MSTA Players',
    'Maharashtra Sports Association',
    'Nagpur Sepaktakraw',
    'Asian Games Sepaktakraw',
  ],
  authors: [{ name: 'Maharashtra Sepak Takraw Association' }],
  creator: 'Maharashtra Sepak Takraw Association',
  publisher: 'Maharashtra Sepak Takraw Association',
  alternates: {
    canonical: 'https://maharashtrasepaktakraw.org',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://maharashtrasepaktakraw.org',
    siteName: 'Maharashtra Sepak Takraw Association',
    title: 'Maharashtra Sepak Takraw Association (MSTA) | Official Portal',
    description:
      'Apex governing body for Sepaktakraw in Maharashtra. Verified tournaments, state squad roster, medal tallies, and 36 district association profiles.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Maharashtra Sepak Takraw Association',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maharashtra Sepak Takraw Association (MSTA)',
    description:
      'Official portal of the Maharashtra Sepak Takraw Association. Tournaments, athlete registry, and district medal standings.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/msta-logo.png',
    shortcut: '/msta-logo.png',
    apple: '/msta-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background scroll-smooth`}>
      <head>
        {/* Preconnect to CDN & Database for instant connection handshakes */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://chcjyndgliurrmhzjmoh.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://chcjyndgliurrmhzjmoh.supabase.co" />

        {/* Global SportsOrganization & Navigation JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'SportsOrganization',
                  '@id': 'https://maharashtrasepaktakraw.org/#organization',
                  name: 'Maharashtra Sepak Takraw Association',
                  alternateName: 'MSTA',
                  url: 'https://maharashtrasepaktakraw.org',
                  logo: 'https://maharashtrasepaktakraw.org/msta-logo.png',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '152-Firefox, Kamdar Bhavan, Pt. Malviya Road, Sitabuldi',
                    addressLocality: 'Nagpur',
                    postalCode: '440012',
                    addressRegion: 'Maharashtra',
                    addressCountry: 'IN',
                  },
                  telephone: '+91 94221 10610',
                  email: 'MSTASecretary2021@gmail.com',
                  memberOf: [
                    {
                      '@type': 'SportsOrganization',
                      name: 'Sepaktakraw Federation of India',
                      alternateName: 'STFI',
                      url: 'https://sepaktakrawindia.com',
                    },
                    {
                      '@type': 'SportsOrganization',
                      name: 'Maharashtra Olympic Association',
                      alternateName: 'MOA',
                    },
                  ],
                },
                {
                  '@type': 'SiteNavigationElement',
                  '@id': 'https://maharashtrasepaktakraw.org/#navigation',
                  name: [
                    'About Us',
                    'Tournaments',
                    'Teams',
                    'Players',
                    'Districts',
                    'News & Updates',
                    'Contact Us',
                  ],
                  url: [
                    'https://maharashtrasepaktakraw.org/about',
                    'https://maharashtrasepaktakraw.org/tournaments',
                    'https://maharashtrasepaktakraw.org/teams',
                    'https://maharashtrasepaktakraw.org/players',
                    'https://maharashtrasepaktakraw.org/districts',
                    'https://maharashtrasepaktakraw.org/news',
                    'https://maharashtrasepaktakraw.org/contact',
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.className} font-sans antialiased text-foreground selection:bg-blue-600 selection:text-white`}>
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
