'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShieldCheck,
  Trophy,
  Sparkles,
  Users,
  Flame,
} from 'lucide-react'
import { getCdnUrl } from '@/lib/cdn-image'

export interface HeroSlide {
  id: string
  image: string
  mobileImage?: string
  alt: string
  kicker: string
  title: string
  subtitle: string
  badgeText: string
  badgeType: 'shield' | 'trophy' | 'sparkles' | 'users' | 'flame'
  primaryCta: { href: string; label: string }
  secondaryCta: { href: string; label: string }
  tabLabel: string
}

interface HeroScrollSequenceProps {
  title?: string
  subtitle?: string
  primaryCta?: { href: string; label: string }
  secondaryCta?: { href: string; label: string }
  kicker?: string
  mediaType?: string // 'video' | 'image'
  imageSrc?: string
  slides?: HeroSlide[]
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'sunback-spike',
    image: '/hero.jpg',
    mobileImage: '/hero/hero_mobile.jpg',
    alt: 'Acrobatic Sunback spike by elite Sepaktakraw athlete in competition',
    kicker: 'Maharashtra Sepaktakraw Association',
    title: 'Maharashtra Sepaktakraw',
    subtitle:
      "Maharashtra's premier governing body for Sepaktakraw — developing state champions, nurturing grassroots talent, and representing Maharashtra at the National Championships.",
    badgeText: 'Official Governing Body · STFI Affiliated',
    badgeType: 'shield',
    primaryCta: { href: '/tournaments', label: 'View Tournaments' },
    secondaryCta: { href: '/about', label: 'Learn More' },
    tabLabel: 'Acrobatic Spike',
  },
  {
    id: 'tournaments-championship',
    image: '/hero/tournaments_hero.jpg',
    alt: 'Sepaktakraw World Cup tournament action with high-flying net spikes in full stadium',
    kicker: 'Sanctioned State Championships',
    title: 'State Championship Circuit',
    subtitle:
      'Fierce competitive action bringing together elite athletes across Senior, Junior, and Sub-Junior divisions from all 36 affiliated districts.',
    badgeText: 'State Championship · 2021–2026',
    badgeType: 'trophy',
    primaryCta: { href: '/tournaments', label: 'Explore Tournaments' },
    secondaryCta: { href: '/districts', label: 'Medal Standings' },
    tabLabel: 'Championships',
  },
  {
    id: 'gravity-defying-athletics',
    image: '/hero/gallery_1.jpg',
    alt: 'Gravity-defying aerial roll spike executed over net defense',
    kicker: 'Olympic-Recognized Asian Sport',
    title: 'Gravity-Defying Athletics',
    subtitle:
      'High-flying bicycle kicks, 140 km/h Tekong serves, and lightning net blocks executed with supreme flexibility and razor-sharp reflexes.',
    badgeText: 'High-Velocity Asian Sport',
    badgeType: 'flame',
    primaryCta: { href: '/players', label: 'Meet the Athletes' },
    secondaryCta: { href: '/about', label: 'About the Sport' },
    tabLabel: 'Aerial Strike',
  },
  {
    id: 'district-network',
    image: '/hero/teams_hero.jpg',
    alt: 'Maharashtra state contingent squad in official federation uniform',
    kicker: 'Grassroots to Elite Pathway',
    title: '36 Affiliated District Units',
    subtitle:
      'Empowering grassroots sports development, coaching camps, and athlete scouting across Vidarbha, Marathwada, Khandesh, Konkan, and Western Maharashtra.',
    badgeText: '36 District Associations',
    badgeType: 'users',
    primaryCta: { href: '/districts', label: 'Find Your District' },
    secondaryCta: { href: '/teams', label: 'Registered Teams' },
    tabLabel: '36 Districts',
  },
  {
    id: 'national-champions',
    image: '/hero/gallery_2.jpg',
    alt: 'Competitive match block and jump contest in championship play',
    kicker: 'National Podium Excellence',
    title: 'Forging Champions for India',
    subtitle:
      'From district selection trials to national podium glory at the National Games and Asian Championships.',
    badgeText: 'National Honours Roll',
    badgeType: 'sparkles',
    primaryCta: { href: '/players', label: 'State Squad' },
    secondaryCta: { href: '/contact', label: 'Get in Touch' },
    tabLabel: 'State Squad',
  },
]

const SLIDE_DURATION_MS = 6000

export function HeroScrollSequence({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  kicker,
  mediaType = 'image',
  imageSrc,
  slides: customSlides,
}: HeroScrollSequenceProps) {
  // Build active slides with overrides
  const slides = (customSlides || DEFAULT_SLIDES).map((s, idx) => {
    if (idx === 0) {
      return {
        ...s,
        image: imageSrc || s.image,
        title: title || s.title,
        subtitle: subtitle || s.subtitle,
        kicker: kicker || s.kicker,
        primaryCta: primaryCta || s.primaryCta,
        secondaryCta: secondaryCta || s.secondaryCta,
      }
    }
    return s
  })

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(Date.now())

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
    setProgress(0)
    lastTickRef.current = Date.now()
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
    lastTickRef.current = Date.now()
  }, [slides.length])

  const goToSlide = (index: number) => {
    setActiveIndex(index)
    setProgress(0)
    lastTickRef.current = Date.now()
  }

  // Smooth progress ticker
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    lastTickRef.current = Date.now()

    const step = () => {
      const now = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now

      setProgress((prev) => {
        const next = prev + (delta / SLIDE_DURATION_MS) * 100
        if (next >= 100) {
          nextSlide()
          return 0
        }
        return next
      })

      animFrameRef.current = requestAnimationFrame(step)
    }

    animFrameRef.current = requestAnimationFrame(step)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying, isHovered, nextSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  const activeSlide = slides[activeIndex]

  const renderBadgeIcon = (type: HeroSlide['badgeType']) => {
    switch (type) {
      case 'trophy':
        return <Trophy size={13} className="text-amber-400" />
      case 'sparkles':
        return <Sparkles size={13} className="text-sky-400" />
      case 'users':
        return <Users size={13} className="text-blue-400" />
      case 'flame':
        return <Flame size={13} className="text-orange-400" />
      case 'shield':
      default:
        return <ShieldCheck size={13} className="text-emerald-400" />
    }
  }

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex min-h-[92vh] sm:min-h-[96vh] overflow-hidden bg-slate-950 text-white select-none"
      aria-roledescription="carousel"
      aria-label="Maharashtra Sepaktakraw Hero Showcase"
    >
      {/* ─── LARGE BACKGROUND HERO IMAGES (CROSS-FADING) ─── */}
      <div className="absolute inset-0">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              {/* Mobile portrait-optimized view */}
              {slide.mobileImage && (
                <img
                  src={getCdnUrl(slide.mobileImage)}
                  alt={slide.alt}
                  className="block sm:hidden absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ease-out brightness-95"
                  style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
                />
              )}

              {/* Desktop / tablet widescreen high-resolution image */}
              <img
                src={getCdnUrl(slide.image)}
                alt={slide.alt}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className={`${
                  slide.mobileImage ? 'hidden sm:block' : ''
                } absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ease-out brightness-[0.88]`}
                style={{ transform: isActive ? 'scale(1.06)' : 'scale(1)' }}
              />
            </div>
          )
        })}
      </div>

      {/* ─── CINEMATIC SPORTS VIGNETTES (Crisp contrast, transparent to action) ─── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent max-w-4xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.18),transparent_65%)]" />

      {/* ─── SIDE NAVIGATION ARROWS ─── */}
      <button
        onClick={prevSlide}
        aria-label="Previous hero image"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/60 hover:bg-blue-600 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 shadow-2xl cursor-pointer"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next hero image"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/60 hover:bg-blue-600 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 shadow-2xl cursor-pointer"
      >
        <ChevronRight size={22} />
      </button>

      {/* ─── MAIN HERO CONTENT AREA ─── */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-4 pb-28 pt-36 sm:px-6 sm:pb-32 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge & Kicker */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold text-white border border-white/15 shadow-sm">
              {renderBadgeIcon(activeSlide.badgeType)}
              {activeSlide.badgeText}
            </span>
            <span className="text-sky-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em]">
              {activeSlide.kicker}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.96] mb-5 drop-shadow-lg">
            {activeSlide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed text-slate-200/90 max-w-2xl drop-shadow-md mb-8">
            {activeSlide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={activeSlide.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-sm font-black text-white transition-all shadow-xl shadow-blue-900/30 hover:scale-105 active:scale-95"
            >
              {activeSlide.primaryCta.label} <ArrowRight size={16} />
            </Link>
            <Link
              href={activeSlide.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/40 backdrop-blur-md px-7 py-3.5 text-sm font-black text-white transition-all hover:bg-white/15 hover:border-white/40"
            >
              {activeSlide.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM THUMBNAILS / SLIDE TABS BAR ─── */}
      <div className="absolute bottom-5 inset-x-0 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-3.5">
          {/* Clickable tabs with live animated progress bars */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4 flex-1 max-w-3xl">
            {slides.map((s, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className="text-left group cursor-pointer focus:outline-none"
                  aria-label={`View slide ${idx + 1}: ${s.tabLabel}`}
                >
                  {/* Progress Line */}
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: isActive ? `${progress}%` : '0%',
                        transition: isActive ? 'width 100ms linear' : 'none',
                      }}
                    />
                  </div>
                  {/* Label */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] sm:text-[11px] font-black uppercase tracking-wider truncate transition-colors ${
                        isActive
                          ? 'text-white font-extrabold'
                          : 'text-white/40 group-hover:text-white/80'
                      }`}
                    >
                      <span className="hidden sm:inline">0{idx + 1} </span>
                      {s.tabLabel}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Controls: Play/Pause and Mobile Arrow indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause hero slideshow' : 'Play hero slideshow'}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <div className="text-[10px] font-mono font-bold text-white/50 hidden sm:block">
              {activeIndex + 1} / {slides.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
