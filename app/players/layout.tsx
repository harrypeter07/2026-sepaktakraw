import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Players',
  description:
    'Discover elite Sepaktakraw players of Maharashtra — athlete profiles, achievements and the talent powering MSTA tournaments.',
  alternates: { canonical: '/players' },
}

export default function PlayersLayout({ children }: { children: React.ReactNode }) {
  return children
}
