import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teams',
  description:
    'Meet the registered Sepaktakraw teams of Maharashtra — rosters, districts and achievements under the Maharashtra Sepak Takraw Association.',
  alternates: { canonical: '/teams' },
}

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  return children
}
