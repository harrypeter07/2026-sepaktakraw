'use client'

import { useSiteSettings } from '@/lib/site-settings'

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
  // falls back to a branded dark gradient — no hardcoded stock imagery.
  const displayImage = imageKey ? img(imageKey) : ''
  const displayTitle = titleKey ? txt(titleKey, title) : title
  const displaySubtitle = subtitleKey ? txt(subtitleKey, subtitle) : subtitle

  return (
    <section className="relative overflow-hidden bg-[#1b3c73] text-white min-h-[44vh] flex items-end">
      {displayImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayImage}
          alt={imageKey ? alt(imageKey, '') : 'Section banner'}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(37,99,235,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.10)_1px,transparent_1px)] bg-[size:48px_48px]" />
      )}
      {/* Left-heavy overlay — image visible on right */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1b3c73] via-[#1b3c73]/80 to-[#1b3c73]/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1b3c73] via-transparent to-[#1b3c73]/50" />

      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {kicker && (
          <span className="text-[#38bdf8] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">
            {kicker}
          </span>
        )}
        <h1 className="text-4xl font-black uppercase leading-tight tracking-tighter text-white sm:text-5xl lg:text-6xl max-w-3xl">
          {displayTitle}
        </h1>
        {displaySubtitle && (
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/55 font-medium leading-relaxed">
            {displaySubtitle}
          </p>
        )}
      </div>
    </section>
  )
}
