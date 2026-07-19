import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tournaments',
  description:
    'Explore upcoming and past Sepaktakraw tournaments organised by MSTA — formats, venues, fixtures and results across Maharashtra.',
  alternates: { canonical: '/tournaments' },
}

export default function TournamentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
