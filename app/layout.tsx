import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Maharashtra Sepak Takraw Association (MSTA) | Official Website',
    template: '%s | Maharashtra Sepak Takraw Association (MSTA)',
  },
  description: 'Official website of the Maharashtra Sepak Takraw Association (MSTA). Discover Sepaktakraw teams, elite players, upcoming tournaments, and local district associations promoting kick-volleyball across Maharashtra, India.',
  keywords: [
    'Sepak Takraw',
    'Maharashtra Sepak Takraw Association',
    'MSTA',
    'Sepaktakraw Maharashtra',
    'Kick Volleyball India',
    'Sepak Takraw Federation of India',
    'MSTA Tournaments',
    'MSTA Teams',
    'MSTA Players',
    'Maharashtra Sports Association'
  ],
  authors: [{ name: 'Maharashtra Sepak Takraw Association' }],
  creator: 'Maharashtra Sepak Takraw Association',
  publisher: 'Maharashtra Sepak Takraw Association',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://maharashtrasepaktakraw.org',
    siteName: 'Maharashtra Sepak Takraw Association',
    title: 'Maharashtra Sepak Takraw Association (MSTA) | Official Website',
    description: 'Promoting excellence and growth in Sepaktakraw (kick-volleyball) across Maharashtra through competitive tournaments, elite player coaching, and active district associations.',
    images: [
      {
        url: '/msta-logo.png',
        width: 500,
        height: 500,
        alt: 'MSTA Official Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Maharashtra Sepak Takraw Association (MSTA)',
    description: 'Promoting excellence and growth in Sepaktakraw across Maharashtra through competitive tournaments and player development.',
    images: ['/msta-logo.png'],
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
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
