import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { HeroScrollSequence } from '@/components/hero-scroll-sequence'
import { ScrollReveal } from '@/components/scroll-reveal'
import { HomeGalleryCarousel } from '@/components/home-gallery-carousel'
import { Trophy, Users, Zap, Target, ArrowRight, Calendar } from 'lucide-react'
import siteContent from '@/lib/site-content.json'
import { getCdnUrl } from '@/lib/cdn-image'
import {
  TeamManager,
  PlayerManager,
  TournamentManager,
  ArticleManager,
  ARTICLE_CATEGORY_LABELS,
  articleExcerpt,
  articleDate,
} from '@/lib/data-manager'

// ISR: Cache pre-rendered page at the edge for 1 hour, revalidating in background.
export const revalidate = 3600

const GALLERY_IMAGES = [
  { key: 'home.gallery_1', alt: 'Athlete in action', fallback: '/hero/gallery_1.jpg' },
  { key: 'home.gallery_2', alt: 'Sports kick', fallback: '/hero/gallery_2.jpg' },
  { key: 'home.gallery_3', alt: 'Athletic performance', fallback: '/hero/gallery_3.jpg' },
  { key: 'home.gallery_4', alt: 'Tournament play', fallback: '/hero/gallery_4.jpg' },
  { key: 'home.gallery_5', alt: 'Sports competition', fallback: '/hero/gallery_5.jpg' },
  { key: 'home.gallery_6', alt: 'Championship match', fallback: '/hero/gallery_6.jpg' },
  { key: 'home.gallery_7', alt: 'Team sports', fallback: '/hero/gallery_7.jpg' },
  { key: 'home.gallery_8', alt: 'Training session', fallback: '/hero.jpg' },
  { key: 'home.gallery_9', alt: 'Youth players', fallback: '/team.jpg' },
]

const FOCUS_AREAS = [
  {
    icon: Trophy,
    title: 'Tournaments',
    desc: 'Competitive state events showcasing athlete talent and team excellence across Maharashtra.',
  },
  {
    icon: Users,
    title: 'Team Management',
    desc: 'Supporting affiliated district units in grassroots player scouting, logistics, and coaching.',
  },
  {
    icon: Zap,
    title: 'Player Development',
    desc: 'Nurturing young talent and advancing athletic capabilities at Senior, Junior, and Sub-Junior levels.',
  },
  {
    icon: Target,
    title: 'Community Growth',
    desc: 'Building a thriving Sepaktakraw sports ecosystem across all 36 districts of Maharashtra.',
  },
]

export default async function Home() {
  // Server-side parallel fetch: 0ms client-side waterfall, instant HTML generation
  const [teams, players, tournaments, articles] = await Promise.all([
    TeamManager.getAll(),
    PlayerManager.getAll(),
    TournamentManager.getAll(),
    ArticleManager.getPublished(),
  ])

  const stats = {
    teams: teams.length,
    players: players.length,
    tournaments: tournaments.length,
  }

  const news = articles.slice(0, 3)

  const settings = siteContent as Record<string, any>
  const heroTitle = settings['home.hero.title']?.text || 'Maharashtra Sepaktakraw'
  const heroSubtitle =
    settings['home.hero.subtitle']?.text ||
    "Maharashtra's premier Sepaktakraw association — developing champions, building community."
  const heroMediaType = settings['home.hero.media_type']?.text || 'image'
  const heroImage = settings['home.hero.image']?.url || '/hero.jpg'
  const aboutImage = settings['home.about.image']?.url || '/team.jpg'

  const carouselItems = GALLERY_IMAGES.map((item) => ({
    key: item.key,
    alt: item.alt,
    src: settings[item.key]?.url || item.fallback,
    fallback: item.fallback,
  }))

  return (
    <>
      <Navbar />
      <ScrollReveal />
      <main className="flex flex-col min-h-screen bg-background overflow-x-clip">
        {/* ─── HERO (scroll-driven sequence) ─── */}
        <HeroScrollSequence
          title={heroTitle}
          subtitle={heroSubtitle}
          primaryCta={{ href: '/tournaments', label: 'View Tournaments' }}
          secondaryCta={{ href: '/about', label: 'Learn More' }}
          mediaType={heroMediaType}
          imageSrc={heroImage}
        />

        {/* ─── HORIZONTAL GALLERY CAROUSEL ─── */}
        <HomeGalleryCarousel items={carouselItems} />

        {/* ─── STATS BAND (Pre-rendered on Server - 0ms delay) ─── */}
        <section className="bg-[#1d4ed8] py-16 sm:py-20 border-b border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-6 sm:gap-16 text-center">
              {[
                { label: 'Registered Teams', value: stats.teams },
                { label: 'Verified Athletes', value: stats.players },
                { label: 'Tournaments Held', value: stats.tournaments },
              ].map((s) => (
                <div key={s.label} className="rise-in">
                  <div className="text-[clamp(2.5rem,8vw,5rem)] font-black text-white tracking-tighter leading-none">
                    {s.value}
                    <span className="text-[#93c5fd]">+</span>
                  </div>
                  <div className="mt-3 text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/40">
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
                    src={getCdnUrl(aboutImage)}
                    alt="Sepaktakraw team training"
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#38bdf8]">
                      Origin & Heritage
                    </span>
                    <p className="mt-1 text-sm font-extrabold text-white">
                      Traditional Southeast Asian kick-volleyball sport dating back centuries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="reveal reveal-d1 order-1 lg:order-2 space-y-5">
                <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">
                  The Sport
                </span>
                <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight text-[#0A0F1E] tracking-tight">
                  WHAT IS SEPAKTAKRAW?
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] rounded-full" />
                <p className="text-slate-600 leading-relaxed text-base">
                  Sepaktakraw is a high-speed Asian team sport combining football athleticism with volleyball geometry. Players use feet, knees, chest, and head to send a rattan/synthetic ball over a 1.52m net — performing gravity-defying Sunback spikes and Roll spikes.
                </p>
                <p className="text-slate-600 leading-relaxed text-base">
                  The Maharashtra Sepaktakraw Association promotes this dynamic Olympic-style sport, develops athletes, and organises sanctioned championships across the state.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1e3a8a] px-7 py-3.5 text-sm font-black text-white hover:bg-[#2563eb] transition-all mt-2 shadow-md hover:shadow-lg"
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
              <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">
                What We Do
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase text-[#0A0F1E] tracking-tight">
                OUR FOCUS AREAS
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FOCUS_AREAS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] transition-transform duration-300 group-hover:scale-x-100 rounded-t-2xl" />
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-[#0A0F1E]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LATEST NEWS (Server-Rendered for SEO & 0ms LCP) ─── */}
        {news.length > 0 && (
          <section className="bg-white py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="reveal flex items-end justify-between mb-12">
                <div>
                  <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">
                    Latest
                  </span>
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
                    <div
                      className={`relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] ${
                        i === 0 ? 'h-56 sm:h-72' : 'h-44'
                      }`}
                    >
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getCdnUrl(item.imageUrl)}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute top-3.5 left-3.5">
                        <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1e3a8a]">
                          {ARTICLE_CATEGORY_LABELS[item.category] || item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                        <Calendar size={13} />
                        <span>{articleDate(item)}</span>
                      </div>
                      <h3
                        className={`font-black text-slate-900 group-hover:text-[#2563eb] transition-colors leading-snug ${
                          i === 0 ? 'text-lg sm:text-xl' : 'text-sm'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {articleExcerpt(item.content, i === 0 ? 160 : 90)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── CTA ─── */}
        <section className="relative overflow-hidden bg-[#1d4ed8] py-20 sm:py-24 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getCdnUrl('/hero/about_hero.jpg')}
            alt="CTA Background"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-20 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d4ed8] via-[#1d4ed8]/85 to-[#1d4ed8]/45 -z-10" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center sm:px-6">
            <span className="text-[#93c5fd] text-[10px] font-black uppercase tracking-[0.3em]">
              Get Started
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              JOIN THE SEPAKTAKRAW MOVEMENT
            </h2>
            <p className="mt-5 text-white/80 text-base leading-relaxed">
              Explore Maharashtra&apos;s active district associations, register as an athlete, or follow state championships.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tournaments"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#1d4ed8] hover:bg-slate-100 transition-all shadow-lg"
              >
                View Tournaments <ArrowRight size={16} />
              </Link>
              <Link
                href="/districts"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-black text-white hover:bg-white/20 transition-all"
              >
                Find Your District
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
