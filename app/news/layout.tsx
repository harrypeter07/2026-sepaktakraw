import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Updates',
  description:
    'Latest Sepaktakraw news, announcements and updates from the Maharashtra Sepak Takraw Association.',
  alternates: { canonical: '/news' },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
