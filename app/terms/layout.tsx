import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Read the Maharashtra Sepak Takraw Association terms of use for this website and its services.',
  alternates: { canonical: '/terms' },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
