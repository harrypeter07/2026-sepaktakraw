import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about the Maharashtra Sepak Takraw Association (MSTA) — our mission, history, values and the community driving kick-volleyball across Maharashtra.',
  alternates: { canonical: '/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
