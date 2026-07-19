'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { Award, ShieldCheck, HeartHandshake, Lightbulb, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSiteSettings } from '@/lib/site-settings'
import { ScrollReveal } from '@/components/scroll-reveal'

// Copy for these sections lives in site settings; only the icon / setting key
// prefix is fixed here.
const VALUES = [
  { key: 'about.value_1', icon: Award },
  { key: 'about.value_2', icon: ShieldCheck },
  { key: 'about.value_3', icon: HeartHandshake },
  { key: 'about.value_4', icon: Lightbulb },
]

const MILESTONES = [
  { key: 'about.milestone_1', imageKey: 'about.milestone_1.image' },
  { key: 'about.milestone_2', imageKey: 'about.milestone_2.image' },
  { key: 'about.milestone_3', imageKey: 'about.milestone_3.image' },
]

const GALLERY_KEYS = [
  'about.gallery_1', 'about.gallery_2', 'about.gallery_3', 'about.gallery_4',
  'about.gallery_5', 'about.gallery_6', 'about.gallery_7', 'about.gallery_8',
]

const SPORT_FACTS = ['about.fact_1', 'about.fact_2', 'about.fact_3', 'about.fact_4']

export default function AboutPage() {
  const { img, alt, txt } = useSiteSettings()
  return (
    <>
      <Navbar />
      <ScrollReveal />
      <main className="flex flex-col min-h-screen bg-white">
        <PageHero
          imageKey="about.hero.image"
          kicker="Who We Are"
          title="About Maharashtra Sepaktakraw Association"
          subtitle="Promoting excellence and growth in Southeast Asian kick-volleyball sport"
        />

        {/* ─── MISSION & VISION ─── */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Mission */}
              <div className="relative overflow-hidden rounded-2xl bg-[#1d4ed8] p-8 sm:p-10 flex flex-col">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="relative">
                  <div className="h-12 w-12 bg-[#2563eb]/20 rounded-xl flex items-center justify-center text-[#38bdf8] mb-6">
                    <Zap size={22} />
                  </div>
                  <h2 className="text-2xl font-black uppercase text-white mb-4 tracking-tight">Our Mission</h2>
                  <div className="h-1 w-12 bg-[#2563eb] rounded-full mb-6" />
                  <p className="text-white/60 leading-relaxed text-sm">
                    {txt('about.mission.text')}
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-8 sm:p-10 flex flex-col">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#2563eb] mb-6">
                  <Award size={22} />
                </div>
                <h2 className="text-2xl font-black uppercase text-[#0A0F1E] mb-4 tracking-tight">Our Vision</h2>
                <div className="h-1 w-12 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] rounded-full mb-6" />
                <p className="text-slate-600 leading-relaxed text-sm">
                  {txt('about.vision.text')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SPORT FACTS BAND ─── */}
        <section className="bg-[#1d4ed8] py-14 sm:py-18 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {SPORT_FACTS.map((key) => (
                <div key={key}>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{txt(`${key}.stat`)}</div>
                  <div className="mt-1.5 text-xs font-black uppercase tracking-wider text-[#38bdf8]">{txt(`${key}.label`)}</div>
                  <div className="mt-1 text-[10px] text-white/30 font-medium">{txt(`${key}.sub`)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CORE VALUES ─── */}
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal mx-auto mb-14 max-w-2xl text-center">
              <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">Core Principles</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase text-[#0A0F1E] tracking-tight">OUR CORE VALUES</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.key} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl">
                    <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] transition-transform duration-300 group-hover:scale-x-100 rounded-t-2xl" />
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-wider mb-3 text-[#0A0F1E]">{txt(`${v.key}.title`)}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{txt(`${v.key}.desc`)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── JOURNEY / TIMELINE ─── */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal mx-auto mb-14 max-w-2xl text-center">
              <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">Timeline</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase text-[#0A0F1E] tracking-tight">OUR JOURNEY</h2>
            </div>

            <div className="space-y-12">
              {MILESTONES.map((m, idx) => (
                <div key={m.key} className={`reveal grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Image side */}
                  <div className={`relative overflow-hidden rounded-2xl shadow-xl ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img(m.imageKey)}
                      alt={alt(m.imageKey, txt(`${m.key}.title`))}
                      className="h-64 sm:h-72 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1d4ed8]/50 to-transparent" />
                    <span className="absolute top-4 left-4 bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {txt(`${m.key}.year`)}
                    </span>
                  </div>

                  {/* Text side */}
                  <div className={`space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#0A0F1E] tracking-tight">{txt(`${m.key}.title`)}</h3>
                    <div className="h-1 w-12 bg-gradient-to-r from-[#2563eb] to-[#38bdf8] rounded-full" />
                    <p className="text-slate-600 leading-relaxed">{txt(`${m.key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PHOTO GALLERY ─── */}
        <section className="bg-[#1d4ed8] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <span className="text-[#38bdf8] text-[10px] font-black uppercase tracking-[0.3em]">Gallery</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">THE SPORT IN PICTURES</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-4 sm:px-6 lg:px-8">
            {GALLERY_KEYS.map((key, i) => (
              <div key={key} className="group relative aspect-square overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img(key)}
                  alt={alt(key, `Sport gallery ${i + 1}`)}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#1d4ed8] py-20 sm:py-24 text-white">
          {/* Background image overlay */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/about_hero.jpg"
            alt="CTA Background"
            className="absolute inset-0 h-full w-full object-cover opacity-20 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d4ed8] via-[#1d4ed8]/85 to-[#1d4ed8]/45 -z-10" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center sm:px-6">
            <span className="text-[#93c5fd] text-[10px] font-black uppercase tracking-[0.3em]">Join Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              BE PART OF THE MOVEMENT
            </h2>
            <p className="mt-5 text-white/80 text-base leading-relaxed">
              Whether you are a player, coach, or fan — there is a place for you in the Maharashtra Sepaktakraw community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#1d4ed8] hover:bg-slate-100 transition-all shadow-lg"
              >
                Get in Touch <ArrowRight size={16} />
              </Link>
              <Link
                href="/tournaments"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-black text-white hover:bg-white/20 transition-all"
              >
                View Tournaments
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
