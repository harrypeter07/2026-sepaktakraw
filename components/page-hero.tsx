'use client'

import { useSiteSettings } from '@/lib/site-settings'

interface PageHeroProps {
  /** site_settings key for the optional background image, e.g. 'teams.hero.image'. */
  imageKey?: string
  kicker?: string
  title: string
  subtitle?: string
}

/**
 * Shared interior-page hero. Renders the admin-configured background image for
 * `imageKey` (from site_settings) with a navy gradient overlay, falling back to
 * a solid primary band when no image is set.
 */
export function PageHero({ imageKey, kicker, title, subtitle }: PageHeroProps) {
  const { img, txt, alt } = useSiteSettings()
  
  const prefix = imageKey && imageKey.includes('.') ? imageKey.substring(0, imageKey.lastIndexOf('.')) : ''
  const titleKey = prefix ? `${prefix}.title` : ''
  const subtitleKey = prefix ? `${prefix}.subtitle` : ''

  const bg = imageKey ? img(imageKey) : ''
  const displayTitle = titleKey ? txt(titleKey, title) : title
  const displaySubtitle = subtitleKey ? txt(subtitleKey, subtitle) : subtitle

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground clip-angle-b border-b border-border">
      {bg ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bg}
            alt={alt(imageKey!, '')}
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
        </>
      ) : (
        <div className="absolute inset-0 -z-10 spotlight" />
      )}

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {kicker && <span className="kicker mb-5">{kicker}</span>}
        <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl text-white">
          {displayTitle}
        </h1>
        {displaySubtitle && (
          <p className="mt-5 max-w-2xl text-lg text-balance opacity-90 sm:text-xl text-slate-100">{displaySubtitle}</p>
        )}
      </div>
    </section>
  )
}
