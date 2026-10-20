import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { NewsClient } from '@/components/news-client'
import { ArticleManager, Article } from '@/lib/data-manager'

export const revalidate = 3600 // ISR: Revalidate every hour

export const metadata: Metadata = {
  title: 'Official News, Bulletins & Press Releases | Maharashtra Sepaktakraw Association',
  description:
    'Stay updated with official bulletins, state championship results, trials, and player selection announcements from the Maharashtra Sepaktakraw Association (MSTA).',
  alternates: {
    canonical: 'https://mahasepaktakraw.com/news',
  },
  openGraph: {
    title: 'Maharashtra Sepaktakraw News & Press Bulletins',
    description:
      'Official announcements, tournament results, and updates from the governing body of Sepaktakraw in Maharashtra.',
    url: 'https://mahasepaktakraw.com/news',
    siteName: 'Maharashtra Sepaktakraw Association',
    type: 'website',
  },
}

export default async function NewsPage() {
  let articles: Article[] = []

  try {
    articles = await ArticleManager.getPublished()
  } catch (error) {
    console.error('Error loading articles on server:', error)
  }

  // Schema.org NewsArticle ItemList
  const newsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Maharashtra Sepaktakraw News & Announcements',
    itemListElement: articles.map((article, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.content.slice(0, 160),
        image: article.imageUrl ? [article.imageUrl] : undefined,
        datePublished: article.publishedAt || article.createdAt,
        author: {
          '@type': 'SportsOrganization',
          name: 'Maharashtra Sepaktakraw Association',
          url: 'https://mahasepaktakraw.com',
        },
        publisher: {
          '@type': 'SportsOrganization',
          name: 'Maharashtra Sepaktakraw Association',
          logo: {
            '@type': 'ImageObject',
            url: 'https://mahasepaktakraw.com/logo.png',
          },
        },
      },
    })),
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      <Navbar />
      <main className="flex-grow">
        <NewsClient initialArticles={articles} />
      </main>
      <Footer />
    </div>
  )
}
