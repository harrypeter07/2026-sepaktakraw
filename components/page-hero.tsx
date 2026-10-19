'use client'

import { useSiteSettings } from '@/lib/site-settings'
import { getCdnUrl } from '@/lib/cdn-image'

interface PageHeroProps {
  imageKey?: string
  kicker?: string
  title: string
  subtitle?: string
}

export function PageHero({ imageKey, kicker, title, subtitle }: PageHeroProps) {
  const { img, txt, alt } = useSiteSettings()

  const prefix = imageKey && imageKey.includes('.') ? imageKey.substring(0, imageKey.lastIndexOf('.')) : ''
  const titleKey = prefix ? `${prefix}.title` : ''
  const subtitleKey = prefix ? `${prefix}.subtitle` : ''

  // Background image is admin-editable per page. When none is set, the section
  // falls back to a branded dark sports gradient.
  const displayImage = imageKey ? img(imageKey) : ''
  const displayTitle = titleKey ? txt(titleKey, title) : title
  const displaySubtitle = subtitleKey ? txt(subtitleKey, subtitle) : subtitle

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[46vh] sm:min-h-[50vh] flex items-end">
      {displayImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getCdnUrl(displayImage)}
          alt={imageKey ? alt(imageKey, '') : 'Section banner'}
          className="absolute inset-0 -z-20 h-full w-full object-cover select-none brightness-90 transition-transform duration-1000 scale-100 hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(37,99,235,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.10)_1px,transparent_1px)] bg-[size:48px_48px]" />
      )}
      {/* Sleek sports cinematic vignette overlay — vivid image, high contrast text */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/40" />

      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative z-10">
        {kicker && (
          <span className="text-[#38bdf8] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-4 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            {kicker}
          </span>
        )}
        <h1 className="text-4xl font-black uppercase leading-tight tracking-tighter text-white sm:text-5xl lg:text-6xl max-w-3xl drop-shadow-md">
          {displayTitle}
        </h1>
        {displaySubtitle && (
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/80 font-medium leading-relaxed drop-shadow-sm">
            {displaySubtitle}
          </p>
        )}
      </div>
    </section>
  )
}
