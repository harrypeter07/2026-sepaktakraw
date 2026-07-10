'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { HeroScrollSequence } from '@/components/hero-scroll-sequence'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Trophy, Users, Zap, Target, ArrowRight, MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useSiteSettings } from '@/lib/site-settings'
import {
  TeamManager, PlayerManager, TournamentManager,
  ArticleManager, Article, ARTICLE_CATEGORY_LABELS, articleExcerpt, articleDate,
} from '@/lib/data-manager'

// Image sources are admin-editable site settings (see SETTING_DESCRIPTORS).
// Only alt text and copy live here; every `src` is resolved via img(key).
const GALLERY_IMAGES = [
  { key: 'home.gallery_1', alt: 'Athlete in action' },
  { key: 'home.gallery_2', alt: 'Sports kick' },
  { key: 'home.gallery_3', alt: 'Athletic performance' },
  { key: 'home.gallery_4', alt: 'Tournament play' },
  { key: 'home.gallery_5', alt: 'Sports competition' },
  { key: 'home.gallery_6', alt: 'Championship match' },
  { key: 'home.gallery_7', alt: 'Team sports' },
  { key: 'home.gallery_8', alt: 'Training session' },
  { key: 'home.gallery_9', alt: 'Youth players' },
]

const GALLERY_FALLBACKS = [
  'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526676023771-7050228b90a8?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&auto=format&fit=crop&q=80',
]

// Titles/descriptions come from site settings (home.focus_*); only the icon is fixed.
const FOCUS_AREAS = [
  { icon: Trophy, key: 'home.focus_1' },
  { icon: Users,  key: 'home.focus_2' },
  { icon: Zap,    key: 'home.focus_3' },
  { icon: Target, key: 'home.focus_4' },
]

export default function Home() {
  const { img, txt, alt } = useSiteSettings()
  const [stats, setStats] = useState({ teams: 0, players: 0, tournaments: 0 })
  const [news, setNews] = useState<Article[]>([])
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [teams, players, tournaments, articles] = await Promise.all([
          TeamManager.getAll(),
          PlayerManager.getAll(),
          TournamentManager.getAll(),
          ArticleManager.getPublished(),
        ])
        setStats({
          teams: teams.length,
          players: players.length,
          tournaments: tournaments.length,
        })
        setNews(articles.slice(0, 3))
      } catch (err) {
        console.error('Error loading homepage data:', err)
      }
    }
    load()
  }, [])

  const aboutImage = img('home.about.image')

  const scrollGallery = (dir: 'left' | 'right') => {
    galleryRef.current?.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' })
  }

  const heroTitle = txt('home.hero.title', '')
  const heroSubtitle = txt('home.hero.subtitle', "Maharashtra's premier Sepaktakraw association — developing champions, building community.")

  return (
    <>
      <Navbar />
      <ScrollReveal />
      <main className="flex flex-col min-h-screen bg-background overflow-x-clip">

        {/* ─── HERO (scroll-driven frame sequence) ─── */}
        <HeroScrollSequence
          title={heroTitle || 'Maharashtra Sepaktakraw'}
          subtitle={heroSubtitle}
          primaryCta={{ href: '/tournaments', label: 'View Tournaments' }}
          secondaryCta={{ href: '/about', label: 'Learn More' }}
          mediaType={txt('home.hero.media_type', 'video')}
          imageSrc={img('home.hero.image')}
        />

        {/* ─── GALLERY STRIP ─── */}
        <section className="bg-[#1d4ed8] py-10 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-end justify-between">
            <div>
              <span className="text-[#93c5fd] text-[10px] font-black uppercase tracking-[0.3em]">Action Gallery</span>
              <h2 className="text-white text-2xl sm:text-3xl font-black uppercase mt-1 tracking-tight">THE SPORT IN MOTION</h2>
            </div>
            <div className="flex gap-2 mb-0.5">
              <button
                onClick={() => scrollGallery('left')}
                className="p-2.5 rounded-full border border-white/20 text-white/50 hover:border-white/55 hover:text-white transition"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollGallery('right')}
                className="p-2.5 rounded-full border border-white/20 text-white/50 hover:border-white/55 hover:text-white transition"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={galleryRef}
            className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-1"
          >
            {GALLERY_IMAGES.map((item, i) => {
              const fallback = GALLERY_FALLBACKS[i % GALLERY_FALLBACKS.length]
              return (
                <div
                  key={i}
                  className="flex-shrink-0 w-48 sm:w-60 h-64 sm:h-76 overflow-hidden rounded-xl relative group cursor-pointer"
                  style={{ height: '18rem' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img(item.key) || fallback}
                    alt={alt(item.key, item.alt)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallback
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── STATS BAND ─── */}
        <section className="bg-[#1d4ed8] py-16 sm:py-20 border-b border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-6 sm:gap-16 text-center">
              {[
                { label: 'Registered Teams', value: stats.teams },
                { label: 'Active Players', value: stats.players },
                { label: 'Tournaments Held', value: stats.tournaments },
              ].map((s) => (
                <div key={s.label} className="rise-in">
                  <div className="text-[clamp(2.5rem,8vw,5rem)] font-black text-white tracking-tighter leading-none">
                    {s.value}<span className="text-[#93c5fd]">+</span>
                  </div>
                  <div className="mt-3 text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/35">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ABOUT THE SPORT ─── */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              {/* Image */}
              <div className="reveal relative order-2 lg:order-1">
                <div className="relative h-[420px] sm:h-[520px] overflow-hidden rounded-2xl shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aboutImage}
                    alt={alt('home.about.image', 'Sepaktakraw team training')}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1d4ed8]/40 to-transparent" />
                  {/* Floating stat badge */}
                  <div className="absolute bottom-5 left-5 bg-[#2563eb] text-white rounded-xl px-5 py-3 shadow-xl">
                    <div className="text-2xl font-black leading-none">35+</div>
                    <div className="text-[10px] font-black uppercase tracking-wider opacity-80 mt-0.5">Years of Excellence</div>
                  </div>
                </div>
                {/* Decorative block */}
                <div className="absolute -bottom-4 -right-4 h-48 w-48 rounded-2xl bg-gradient-to-br from-[#2563eb]/15 to-[#38bdf8]/5 -z-10" />
              </div>

              {/* Text */}
              <div className="reveal reveal-d1 order-1 lg:order-2 space-y-5">
                <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">The Sport</span>
                <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight text-[#0A0F1E] tracking-tight">
                  {txt('home.about.title', 'WHAT IS SEPAKTAKRAW?')}
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] rounded-full" />
                <p className="text-slate-600 leading-relaxed text-base">
                  {txt('home.about.desc_1', 'Sepaktakraw is a Southeast Asian team sport combining volleyball with martial arts. Players use feet, knees, chest and head to send a rattan ball over a net — a spectacular display of agility, timing and precision.')}
                </p>
                <p className="text-slate-600 leading-relaxed text-base">
                  {txt('home.about.desc_2', 'The Maharashtra Sepaktakraw Association promotes this dynamic sport, develops athletes and organises competitive tournaments across the region.')}
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1e3a8a] px-7 py-3.5 text-sm font-black text-white hover:bg-[#2563eb] transition-all mt-2"
                >
                  Explore Our Mission <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOCUS AREAS ─── */}
        <section className="bg-slate-50 py-20 sm:py-24 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="reveal mx-auto mb-14 max-w-2xl text-center">
              <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">What We Do</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase text-[#0A0F1E] tracking-tight">
                OUR FOCUS AREAS
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FOCUS_AREAS.map(({ icon: Icon, key }) => (
                <div
                  key={key}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] transition-transform duration-300 group-hover:scale-x-100 rounded-t-2xl" />
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-[#0A0F1E]">{txt(`${key}.title`)}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{txt(`${key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LATEST NEWS ─── */}
        {news.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-end justify-between mb-12">
              <div>
                <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">Latest</span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-black uppercase text-[#0A0F1E] tracking-tight">
                  NEWS & UPDATES
                </h2>
              </div>
              <Link
                href="/news"
                className="text-sm font-black text-[#2563eb] hover:text-blue-800 flex items-center gap-1 transition"
              >
                All News <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {news.map((item, i) => (
                <Link
                  href="/news"
                  key={item.id}
                  className={`group block rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 bg-white ${
                    i === 0 ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] ${i === 0 ? 'h-56 sm:h-72' : 'h-44'}`}>
                    {item.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      {ARTICLE_CATEGORY_LABELS[item.category]}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold mb-2">
                      <Calendar size={11} />
                      {articleDate(item)}
                    </div>
                    <h3
                      className={`font-black text-[#0A0F1E] leading-snug group-hover:text-[#2563eb] transition line-clamp-2 ${
                        i === 0 ? 'text-xl sm:text-2xl' : 'text-base'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {i === 0 && (
                      <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">{articleExcerpt(item.content)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ─── CTA ─── */}
        <section className="relative overflow-hidden bg-[#1d4ed8] py-20 sm:py-28">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-96 bg-[#2563eb]/10 blur-[80px] rounded-full -z-10" />

          <div className="reveal mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-[#38bdf8] text-[10px] font-black uppercase tracking-[0.3em]">Get Involved</span>
            <h2 className="mt-4 text-4xl sm:text-6xl font-black uppercase leading-tight text-white tracking-tight">
              {txt('home.cta.title', 'READY TO JOIN THE ACTION?')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-white/45 font-medium">
              {txt('home.cta.subtitle', 'Explore our tournaments, teams and players to stay connected with the sport.')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/tournaments"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563eb] px-8 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
              >
                Browse Tournaments
              </Link>
              <Link
                href="/teams"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-black text-white hover:bg-white/10 transition-all"
              >
                <MapPin size={16} /> Meet the Teams
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
