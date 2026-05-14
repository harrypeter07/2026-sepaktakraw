'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

const SAMPLE_NEWS = [
  {
    id: '1',
    title: 'Mumbai Strikers Win Maharashtra Premier League',
    date: 'Feb 28, 2025',
    category: 'Tournament',
    excerpt: 'In an exciting final match, Mumbai Strikers defeated Pune Eagles 3-1 to clinch the 2025 Maharashtra Premier League title.',
  },
  {
    id: '2',
    title: 'Youth Development Program Launches Successfully',
    date: 'Feb 20, 2025',
    category: 'Development',
    excerpt: 'The MSA Youth Development Program kicks off with 50 young talents registered for training across six cities in Maharashtra.',
  },
  {
    id: '3',
    title: 'State Team Selected for National Championship',
    date: 'Feb 10, 2025',
    category: 'Selection',
    excerpt: 'The Maharashtra state team has been selected for the upcoming National Sepaktakraw Championship. The team consists of 12 experienced players.',
  },
  {
    id: '4',
    title: 'New Training Facility Opens in Pune',
    date: 'Jan 30, 2025',
    category: 'Infrastructure',
    excerpt: 'A state-of-the-art Sepaktakraw training facility has opened in Pune with three professional courts and world-class coaching staff.',
  },
  {
    id: '5',
    title: 'Player Interview: Rising Star Priya Sharma',
    date: 'Jan 15, 2025',
    category: 'Interview',
    excerpt: 'We sit down with Priya Sharma, the talented setter from Pune Eagles, to discuss her journey in Sepaktakraw and future aspirations.',
  },
  {
    id: '6',
    title: 'University Championship Registration Opens',
    date: 'Jan 5, 2025',
    category: 'Event',
    excerpt: 'Registration is now open for the University Championship scheduled in March. Teams from 15 universities have already registered.',
  },
]

export default function NewsPage() {
  const categories = Array.from(new Set(SAMPLE_NEWS.map(n => n.category)))

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              News & Updates
            </h1>
            <p className="text-xl opacity-90 text-balance">
              Stay informed with the latest from Maharashtra Sepaktakraw
            </p>
          </div>
        </section>

        {/* News List */}
        <section className="py-16 sm:py-24 bg-background flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {SAMPLE_NEWS.map(news => (
                <Card key={news.id} className="p-6 hover:shadow-lg transition">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-balance">{news.title}</h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                          {news.category}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Calendar size={14} />
                          {news.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {news.excerpt}
                  </p>
                  <button className="text-accent hover:text-accent/80 font-medium transition">
                    Read More →
                  </button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
