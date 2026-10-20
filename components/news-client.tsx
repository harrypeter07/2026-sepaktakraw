'use client'

import { getCdnUrl } from '@/lib/cdn-image'

import { useState } from 'react'
import { PageHero } from '@/components/page-hero'
import { Calendar, Clock, ArrowRight, X, Newspaper } from 'lucide-react'
import {
  Article,
  ARTICLE_CATEGORY_LABELS,
  articleExcerpt,
  articleReadTime,
  articleDate,
} from '@/lib/data-manager'

const CATEGORY_STYLES: Record<string, string> = {
  news: 'bg-blue-600 text-white',
  tournament: 'bg-emerald-600 text-white',
  team: 'bg-purple-600 text-white',
  player: 'bg-rose-600 text-white',
  other: 'bg-slate-700 text-white',
}

interface NewsClientProps {
  initialArticles: Article[]
}

export function NewsClient({ initialArticles }: NewsClientProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const featured = initialArticles[0]
  const rest = initialArticles.slice(1)

  return (
    <>
      <PageHero
        imageKey="news.hero.image"
        kicker="Latest"
        title="News & Updates"
        subtitle="Stay informed with the latest from Maharashtra Sepaktakraw"
      />

      <section className="py-16 sm:py-24 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {initialArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border shadow-sm max-w-lg mx-auto">
              <Newspaper className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-bold">No news yet</p>
              <p className="text-slate-400 text-sm mt-1">Published articles will appear here.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && (
                <button
                  onClick={() => setSelectedArticle(featured)}
                  className="group w-full text-left block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 mb-10 bg-white cursor-pointer"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 sm:h-80 lg:h-full overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#2563eb]">
                      {featured.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getCdnUrl(featured.imageUrl)}
                          alt={featured.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span
                        className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg ${
                          CATEGORY_STYLES[featured.category] || 'bg-slate-700 text-white'
                        }`}
                      >
                        {ARTICLE_CATEGORY_LABELS[featured.category]}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center p-8 sm:p-10">
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mb-4">
                        <Calendar size={13} /> {articleDate(featured)}
                        <span className="text-slate-200">•</span>
                        <Clock size={13} /> {articleReadTime(featured.content)}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1E] leading-snug mb-4 group-hover:text-[#2563eb] transition">
                        {featured.title}
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {articleExcerpt(featured.content)}
                      </p>
                      <div className="flex items-center gap-2 text-[#2563eb] font-black text-sm">
                        Read Full Article <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedArticle(item)}
                      className="group text-left block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#2563eb]">
                        {item.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getCdnUrl(item.imageUrl)}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <span
                          className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-md ${
                            CATEGORY_STYLES[item.category] || 'bg-slate-700 text-white'
                          }`}
                        >
                          {ARTICLE_CATEGORY_LABELS[item.category]}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold mb-3">
                          <Calendar size={11} /> {articleDate(item)}
                          <span className="text-slate-200">•</span>
                          <Clock size={11} /> {articleReadTime(item.content)}
                        </div>
                        <h3 className="font-black text-[#0A0F1E] text-base leading-snug mb-3 group-hover:text-[#2563eb] transition line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                          {articleExcerpt(item.content)}
                        </p>
                        <div className="mt-4 flex items-center gap-1.5 text-[#2563eb] font-black text-xs">
                          Read Article <ArrowRight size={12} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb]">
              {selectedArticle.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getCdnUrl(selectedArticle.imageUrl)}
                  alt={selectedArticle.title}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <span
                className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                  CATEGORY_STYLES[selectedArticle.category] || 'bg-slate-700 text-white'
                }`}
              >
                {ARTICLE_CATEGORY_LABELS[selectedArticle.category]}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mb-4">
                <Calendar size={13} /> {articleDate(selectedArticle)}
                <span className="text-slate-200">•</span>
                <Clock size={13} /> {articleReadTime(selectedArticle.content)}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1E] leading-snug mb-6">
                {selectedArticle.title}
              </h2>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                {selectedArticle.content.split('\n\n').map((para, idx) => (
                  <p key={idx} className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
