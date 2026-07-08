'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Home hero. Switchable from the admin panel (home.hero.media_type):
//   • "video" → autoplays hero.mp4 (muted) and plays through completely.
//   • "image" → shows the admin-chosen hero image (home.hero.image).
// Reduced-motion users never get autoplay: video mode falls back to a static
// end-frame. Media uses object-contain so the full frame (and the image's logo
// + wordmark) is visible — not cropped/zoomed.

const VIDEO_SRC = '/hero/hero.mp4'
const POSTER = '/hero/poster.jpg'
const POSTER_END = '/hero/poster-end.jpg'
const FALLBACK_IMAGE = '/hero/hero-image.jpg'

interface HeroScrollSequenceProps {
  title: string
  subtitle: string
  primaryCta: { href: string; label: string }
  secondaryCta: { href: string; label: string }
  kicker?: string
  mediaType?: string // 'video' | 'image'
  imageSrc?: string
}

export function HeroScrollSequence({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  kicker = 'Maharashtra Sepaktakraw Association',
  mediaType = 'video',
  imageSrc,
}: HeroScrollSequenceProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const isImage = mediaType === 'image'
  // video mode under reduced motion → static end-frame
  const kind: 'video' | 'image' | 'poster' = isImage
    ? 'image'
    : reducedMotion
      ? 'poster'
      : 'video'

  // Explicit play() for browsers that ignore the autoPlay attribute.
  useEffect(() => {
    if (kind !== 'video') return
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => v.play().catch(() => {})
    if (v.readyState >= 2) tryPlay()
    else v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [kind])

  return (
    <section className="relative flex min-h-[90vh] overflow-hidden bg-[#060C1A]">
      {kind === 'video' ? (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER}
          autoPlay
          muted={true}
          playsInline
          loop={true}
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={kind === 'image' ? imageSrc || FALLBACK_IMAGE : POSTER_END}
          alt={title}
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}

      {/* Subtle vignettes for legibility against the dark stage */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060C1A] via-transparent to-[#060C1A]/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#060C1A]/60 via-transparent to-transparent" />

      <h1 className="sr-only">{title}</h1>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <span className="mb-5 block text-[#38bdf8] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
          {kicker}
        </span>
        <div className="max-w-xl">
          <p className="text-base sm:text-lg font-medium leading-relaxed text-white/70">{subtitle}</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95"
            >
              {primaryCta.label} <ArrowRight size={16} />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-black text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
