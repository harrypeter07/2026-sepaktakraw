'use client'

import { useEffect, useState } from 'react'
import { FEATURE_FLAGS } from './feature-flags'
import { supabase } from './supabase'

// A single site setting value. Image keys use `url` (+ optional `alt`/`caption`);
// text keys use `text`. JSONB in the DB lets one row carry either shape.
export interface SettingValue {
  url?: string
  alt?: string
  caption?: string
  text?: string
}

export type SiteSettings = Record<string, SettingValue>

// Metadata describing every editable setting. Drives the admin UI grouping and
// labels, and provides the render-time fallback so pages work before the
// `site_settings` table (migration 005) is applied or populated.
export interface SettingDescriptor {
  key: string
  label: string
  page: string // group: 'home' | 'about' | 'news' | 'teams' | 'players' | 'tournaments' | 'global'
  type: 'image' | 'text'
  shape?: 'avatar' | 'banner' // for image settings, hints the upload preview shape
  default: SettingValue
}

export const SETTING_DESCRIPTORS: SettingDescriptor[] = [
  // Global -----------------------------------------------------------------
  { key: 'site.logo', label: 'Site Logo', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  { key: 'site.og_image', label: 'Social Share Image', page: 'global', type: 'image', shape: 'banner', default: { url: '' } },
  // Homepage ---------------------------------------------------------------
  { key: 'home.hero.image', label: 'Hero Background', page: 'home', type: 'image', shape: 'banner', default: { url: '/hero.jpg', alt: 'Sepaktakraw action' } },
  { key: 'home.hero.title', label: 'Hero Title', page: 'home', type: 'text', default: { text: 'Maharashtra Sepaktakraw' } },
  { key: 'home.hero.subtitle', label: 'Hero Subtitle', page: 'home', type: 'text', default: { text: 'Excellence in Asian Kick-Volleyball Sport' } },
  { key: 'home.about.image', label: 'About Section Image', page: 'home', type: 'image', shape: 'banner', default: { url: '/team.jpg', alt: 'Sepaktakraw team' } },
  { key: 'home.cta.image', label: 'CTA Background', page: 'home', type: 'image', shape: 'banner', default: { url: '' } },
  // About ------------------------------------------------------------------
  { key: 'about.hero.image', label: 'About Hero Background', page: 'about', type: 'image', shape: 'banner', default: { url: '' } },
  // News -------------------------------------------------------------------
  { key: 'news.hero.image', label: 'News Hero Background', page: 'news', type: 'image', shape: 'banner', default: { url: '' } },
  // Browse pages -----------------------------------------------------------
  { key: 'teams.hero.image', label: 'Teams Hero Background', page: 'teams', type: 'image', shape: 'banner', default: { url: '' } },
  { key: 'players.hero.image', label: 'Players Hero Background', page: 'players', type: 'image', shape: 'banner', default: { url: '' } },
  { key: 'tournaments.hero.image', label: 'Tournaments Hero Background', page: 'tournaments', type: 'image', shape: 'banner', default: { url: '' } },
]

// Render-time fallback map derived from the descriptors.
export const SETTINGS_DEFAULTS: SiteSettings = SETTING_DESCRIPTORS.reduce(
  (acc, d) => {
    acc[d.key] = d.default
    return acc
  },
  {} as SiteSettings,
)

export const SettingsManager = {
  // Returns defaults merged with any DB overrides. Never throws — on any
  // failure it falls back to the static defaults so pages always render.
  getAll: async (): Promise<SiteSettings> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
        if (error) throw error
        const fromDb: SiteSettings = {}
        for (const row of data ?? []) {
          fromDb[row.key as string] = (row.value ?? {}) as SettingValue
        }
        return { ...SETTINGS_DEFAULTS, ...fromDb }
      } catch (err) {
        console.error('site_settings fetch failed, using defaults:', err)
      }
    }
    return { ...SETTINGS_DEFAULTS }
  },

  get: async (key: string): Promise<SettingValue> => {
    const all = await SettingsManager.getAll()
    return all[key] ?? {}
  },

  // Admin-only (enforced by RLS). Upserts so the first edit creates the row
  // even if the migration seed wasn't run. Throws on auth/RLS failure so the
  // caller can surface it.
  set: async (key: string, value: SettingValue): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('You must be signed in to change site settings.')

    const { error } = await supabase.from('site_settings').upsert(
      {
        key,
        value,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' },
    )
    if (error) throw error
  },
}

// Client hook for public pages. Seeds state with defaults so first paint never
// flashes empty, then hydrates with DB values.
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(SETTINGS_DEFAULTS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let active = true
    SettingsManager.getAll()
      .then((s) => {
        if (active) setSettings(s)
      })
      .finally(() => {
        if (active) setIsLoaded(true)
      })
    return () => {
      active = false
    }
  }, [])

  // url with a caller-supplied fallback baked in
  const img = (key: string, fallback = '') => settings[key]?.url || fallback
  const alt = (key: string, fallback = '') => settings[key]?.alt || fallback
  const txt = (key: string, fallback = '') => settings[key]?.text || fallback

  return { settings, isLoaded, img, alt, txt }
}
