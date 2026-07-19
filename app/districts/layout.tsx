import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Districts',
  description:
    'Browse MSTA district associations across Maharashtra connecting local Sepaktakraw clubs, players and coaches.',
  alternates: { canonical: '/districts' },
}

export default function DistrictsLayout({ children }: { children: React.ReactNode }) {
  return children
}
