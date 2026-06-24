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
  { key: 'site.navbar_brand', label: 'Navbar Brand Text', page: 'global', type: 'text', default: { text: 'MSA' } },
  { 
    key: 'site.custom_form_schema', 
    label: 'Custom Form Schema (JSON)', 
    page: 'global', 
    type: 'text', 
    default: { 
      text: JSON.stringify({
        id: 'contact',
        title: 'Contact Form',
        fields: [
          { id: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Rahul Sharma' },
          { id: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'e.g. rahul@example.com' },
          { id: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: 'e.g. +91 98765 43210' },
          { id: 'category', label: 'Query Category', type: 'select', required: true, options: ['General Inquiry', 'Join a Team', 'Tournament Inquiry', 'Sponsorship Opportunity', 'Other'] },
          { id: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'What is this regarding?' },
          { id: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Type your message here...' }
        ]
      }) 
    } 
  },
  { key: 'site.og_image', label: 'Social Share Image', page: 'global', type: 'image', shape: 'banner', default: { url: '' } },
  { key: 'site.footer_title', label: 'Footer Title', page: 'global', type: 'text', default: { text: 'Maharashtra Sepaktakraw' } },
  { key: 'site.footer_desc', label: 'Footer Description', page: 'global', type: 'text', default: { text: 'Promoting excellence and growth in Sepaktakraw across Maharashtra through competitive tournaments and player development.' } },
  { key: 'site.footer_contact_address', label: 'Footer Contact Address', page: 'global', type: 'text', default: { text: 'Maharashtra, India' } },
  { key: 'site.footer_contact_phone', label: 'Footer Contact Phone', page: 'global', type: 'text', default: { text: '+91 (XXX) XXX-XXXX' } },
  { key: 'site.footer_contact_email', label: 'Footer Contact Email', page: 'global', type: 'text', default: { text: 'info@msa.org.in' } },
  { key: 'site.footer_copyright', label: 'Footer Copyright Text', page: 'global', type: 'text', default: { text: '2025 Maharashtra Sepaktakraw Association. All rights reserved.' } },
  { key: 'site.footer_logo_1', label: 'Sponsor Logo 1', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  { key: 'site.footer_logo_2', label: 'Sponsor Logo 2', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  { key: 'site.footer_logo_3', label: 'Sponsor Logo 3', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  { key: 'site.footer_logo_4', label: 'Sponsor Logo 4', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  
  // Homepage ---------------------------------------------------------------
  { key: 'home.hero.image', label: 'Hero Background', page: 'home', type: 'image', shape: 'banner', default: { url: '/hero.jpg', alt: 'Sepaktakraw action' } },
  { key: 'home.hero.title', label: 'Hero Title', page: 'home', type: 'text', default: { text: 'Maharashtra Sepaktakraw' } },
  { key: 'home.hero.subtitle', label: 'Hero Subtitle', page: 'home', type: 'text', default: { text: 'Excellence in Asian Kick-Volleyball Sport' } },
  { key: 'home.about.title', label: 'About Section Title', page: 'home', type: 'text', default: { text: 'What is Sepaktakraw?' } },
  { key: 'home.about.desc_1', label: 'About Section Desc 1', page: 'home', type: 'text', default: { text: 'Sepaktakraw is a Southeast Asian team sport that fuses volleyball with martial arts. Players use their feet, knees, chest and head to send a rattan ball over a net — a spectacular display of agility, timing and precision.' } },
  { key: 'home.about.desc_2', label: 'About Section Desc 2', page: 'home', type: 'text', default: { text: 'The Maharashtra Sepaktakraw Association promotes this dynamic sport, develops athletes and organises competitive tournaments across the region.' } },
  { key: 'home.about.image', label: 'About Section Image', page: 'home', type: 'image', shape: 'banner', default: { url: '/team.jpg', alt: 'Sepaktakraw team' } },
  { key: 'home.focus_1.title', label: 'Focus 1 Title', page: 'home', type: 'text', default: { text: 'Tournaments' } },
  { key: 'home.focus_1.desc', label: 'Focus 1 Description', page: 'home', type: 'text', default: { text: 'Competitive events showcasing player talent and team excellence across the state.' } },
  { key: 'home.focus_2.title', label: 'Focus 2 Title', page: 'home', type: 'text', default: { text: 'Team Management' } },
  { key: 'home.focus_2.desc', label: 'Focus 2 Description', page: 'home', type: 'text', default: { text: 'Supporting clubs and teams in player development, logistics and coordination.' } },
  { key: 'home.focus_3.title', label: 'Focus 3 Title', page: 'home', type: 'text', default: { text: 'Player Development' } },
  { key: 'home.focus_3.desc', label: 'Focus 3 Description', page: 'home', type: 'text', default: { text: 'Nurturing young talent and advancing athletic capabilities at every level.' } },
  { key: 'home.focus_4.title', label: 'Focus 4 Title', page: 'home', type: 'text', default: { text: 'Community Growth' } },
  { key: 'home.focus_4.desc', label: 'Focus 4 Description', page: 'home', type: 'text', default: { text: 'Building a thriving Sepaktakraw community across all of Maharashtra.' } },
  { key: 'home.cta.title', label: 'CTA Section Title', page: 'home', type: 'text', default: { text: 'Ready to Join the Action?' } },
  { key: 'home.cta.subtitle', label: 'CTA Section Subtitle', page: 'home', type: 'text', default: { text: 'Explore our tournaments, teams and players to stay connected with the sport.' } },
  { key: 'home.cta.image', label: 'CTA Background', page: 'home', type: 'image', shape: 'banner', default: { url: '' } },

  // About ------------------------------------------------------------------
  { key: 'about.hero.image', label: 'About Hero Background', page: 'about', type: 'image', shape: 'banner', default: { url: '' } },
  { key: 'about.hero.title', label: 'About Hero Title', page: 'about', type: 'text', default: { text: 'About Maharashtra Sepaktakraw Association' } },
  { key: 'about.hero.subtitle', label: 'About Hero Subtitle', page: 'about', type: 'text', default: { text: 'Promoting excellence and growth in Southeast Asian kick-volleyball sport' } },

  // News -------------------------------------------------------------------
  { key: 'news.hero.image', label: 'News Hero Background', page: 'news', type: 'image', shape: 'banner', default: { url: '' } },
  { key: 'news.hero.title', label: 'News Hero Title', page: 'news', type: 'text', default: { text: 'Latest News' } },
  { key: 'news.hero.subtitle', label: 'News Hero Subtitle', page: 'news', type: 'text', default: { text: 'Updates from Maharashtra Sepaktakraw Association' } },

  // Browse pages -----------------------------------------------------------
  { key: 'teams.hero.image', label: 'Teams Hero Background', page: 'teams', type: 'image', shape: 'banner', default: { url: '' } },
  { key: 'teams.hero.title', label: 'Teams Hero Title', page: 'teams', type: 'text', default: { text: 'Teams' } },
  { key: 'teams.hero.subtitle', label: 'Teams Hero Subtitle', page: 'teams', type: 'text', default: { text: 'Meet the competitive teams across Maharashtra' } },

  { key: 'players.hero.image', label: 'Players Hero Background', page: 'players', type: 'image', shape: 'banner', default: { url: '' } },
  { key: 'players.hero.title', label: 'Players Hero Title', page: 'players', type: 'text', default: { text: 'Players' } },
  { key: 'players.hero.subtitle', label: 'Players Hero Subtitle', page: 'players', type: 'text', default: { text: 'Discover elite Sepaktakraw athletes' } },

  { key: 'tournaments.hero.image', label: 'Tournaments Hero Background', page: 'tournaments', type: 'image', shape: 'banner', default: { url: '' } },
  { key: 'tournaments.hero.title', label: 'Tournaments Hero Title', page: 'tournaments', type: 'text', default: { text: 'Tournaments' } },
  { key: 'tournaments.hero.subtitle', label: 'Tournaments Hero Subtitle', page: 'tournaments', type: 'text', default: { text: 'Explore upcoming, ongoing, and completed tournaments' } },
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
