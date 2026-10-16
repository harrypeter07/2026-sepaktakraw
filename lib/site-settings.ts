'use client'

import siteContent from './site-content.json'

// A single site setting value. Image keys use `url` (+ optional `alt`/`caption`);
// text keys use `text`. JSONB in the DB lets one row carry either shape.
export interface SettingValue {
  url?: string
  alt?: string
  caption?: string
  text?: string
}

export type SiteSettings = Record<string, SettingValue>

export interface SettingDescriptor {
  key: string
  label: string
  page: string // group: 'home' | 'about' | 'news' | 'teams' | 'players' | 'tournaments' | 'global'
  type: 'image' | 'text'
  shape?: 'avatar' | 'banner' // for image settings, hints the upload preview shape
  options?: string[] // when set, the admin renders a <select> of these values (stored in `text`)
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
  { key: 'site.footer_contact_address', label: 'Footer Contact Address', page: 'global', type: 'text', default: { text: 'MSTA State Headquarters, Shree Shiv Chhatrapati Sports Complex, Balewadi, Pune, Maharashtra 411045' } },
  { key: 'site.footer_contact_phone', label: 'Footer Contact Phone', page: 'global', type: 'text', default: { text: '+91 94220 18234 / +91 20 2737 4000' } },
  { key: 'site.footer_contact_email', label: 'Footer Contact Email', page: 'global', type: 'text', default: { text: 'info@msa.org.in' } },
  { key: 'site.footer_copyright', label: 'Footer Copyright Text', page: 'global', type: 'text', default: { text: '2026 Maharashtra Sepaktakraw Association. All rights reserved.' } },
  { key: 'site.footer_logo_1', label: 'Sponsor Logo 1', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  { key: 'site.footer_logo_2', label: 'Sponsor Logo 2', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  { key: 'site.footer_logo_3', label: 'Sponsor Logo 3', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  { key: 'site.footer_logo_4', label: 'Sponsor Logo 4', page: 'global', type: 'image', shape: 'avatar', default: { url: '' } },
  
  // Homepage ---------------------------------------------------------------
  { key: 'home.hero.media_type', label: 'Hero Media Type (video or image)', page: 'home', type: 'text', options: ['video', 'image'], default: { text: 'video' } },
  { key: 'home.hero.image', label: 'Hero Image (used when media type is "image")', page: 'home', type: 'image', shape: 'banner', default: { url: '/hero/hero-image.jpg', alt: 'Sepaktakraw Federation of India' } },
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
  { key: 'about.mission.text', label: 'Mission Statement', page: 'about', type: 'text', default: { text: 'To promote, develop, and advance the sport of Sepaktakraw in Maharashtra by organizing competitive tournaments, developing world-class athletes, and building a thriving community of passionate players and fans. We are committed to excellence, fair play, and the growth of the sport at all levels.' } },
  { key: 'about.vision.text', label: 'Vision Statement', page: 'about', type: 'text', default: { text: 'To establish Maharashtra as a leading hub for Sepaktakraw in Asia, recognized for producing elite athletes and hosting premier international tournaments. We envision a thriving ecosystem where the sport continues to grow and inspire future generations.' } },
  { key: 'about.fact_1.stat', label: 'Sport Fact 1 — Value', page: 'about', type: 'text', default: { text: '3' } },
  { key: 'about.fact_1.label', label: 'Sport Fact 1 — Label', page: 'about', type: 'text', default: { text: 'Players per team (Regu)' } },
  { key: 'about.fact_1.sub', label: 'Sport Fact 1 — Caption', page: 'about', type: 'text', default: { text: 'Core competitive format' } },
  { key: 'about.fact_2.stat', label: 'Sport Fact 2 — Value', page: 'about', type: 'text', default: { text: '1.52m' } },
  { key: 'about.fact_2.label', label: 'Sport Fact 2 — Label', page: 'about', type: 'text', default: { text: 'Net height (Men)' } },
  { key: 'about.fact_2.sub', label: 'Sport Fact 2 — Caption', page: 'about', type: 'text', default: { text: 'International standard' } },
  { key: 'about.fact_3.stat', label: 'Sport Fact 3 — Value', page: 'about', type: 'text', default: { text: '1965' } },
  { key: 'about.fact_3.label', label: 'Sport Fact 3 — Label', page: 'about', type: 'text', default: { text: 'SEA Games debut' } },
  { key: 'about.fact_3.sub', label: 'Sport Fact 3 — Caption', page: 'about', type: 'text', default: { text: 'Southeast Asian Games' } },
  { key: 'about.fact_4.stat', label: 'Sport Fact 4 — Value', page: 'about', type: 'text', default: { text: '65+' } },
  { key: 'about.fact_4.label', label: 'Sport Fact 4 — Label', page: 'about', type: 'text', default: { text: 'Countries' } },
  { key: 'about.fact_4.sub', label: 'Sport Fact 4 — Caption', page: 'about', type: 'text', default: { text: 'Play Sepaktakraw globally' } },
  { key: 'about.value_1.title', label: 'Core Value 1 — Title', page: 'about', type: 'text', default: { text: 'Excellence' } },
  { key: 'about.value_1.desc', label: 'Core Value 1 — Description', page: 'about', type: 'text', default: { text: 'Pursuing the highest standards in athlete training, league administration, and team competition.' } },
  { key: 'about.value_2.title', label: 'Core Value 2 — Title', page: 'about', type: 'text', default: { text: 'Integrity' } },
  { key: 'about.value_2.desc', label: 'Core Value 2 — Description', page: 'about', type: 'text', default: { text: 'Upholding honesty, respect, and fair play across all tournaments and selection trials.' } },
  { key: 'about.value_3.title', label: 'Core Value 3 — Title', page: 'about', type: 'text', default: { text: 'Community' } },
  { key: 'about.value_3.desc', label: 'Core Value 3 — Description', page: 'about', type: 'text', default: { text: 'Building strong connections between players, regional clubs, fans, and school programs.' } },
  { key: 'about.value_4.title', label: 'Core Value 4 — Title', page: 'about', type: 'text', default: { text: 'Innovation' } },
  { key: 'about.value_4.desc', label: 'Core Value 4 — Description', page: 'about', type: 'text', default: { text: 'Embracing modern coaching methodologies, facility design, and grassroots talent scouting.' } },
  { key: 'about.milestone_1.year', label: 'Milestone 1 — Era Tag', page: 'about', type: 'text', default: { text: 'Founded' } },
  { key: 'about.milestone_1.title', label: 'Milestone 1 — Title', page: 'about', type: 'text', default: { text: 'Official Governing Body' } },
  { key: 'about.milestone_1.desc', label: 'Milestone 1 — Description', page: 'about', type: 'text', default: { text: 'Established as the official governing body for Sepaktakraw in Maharashtra, dedicated to promoting the sport and developing local talent from grassroots levels.' } },
  { key: 'about.milestone_2.year', label: 'Milestone 2 — Era Tag', page: 'about', type: 'text', default: { text: 'Growth Phase' } },
  { key: 'about.milestone_2.title', label: 'Milestone 2 — Title', page: 'about', type: 'text', default: { text: 'Tournament Expansion & Clubs' } },
  { key: 'about.milestone_2.desc', label: 'Milestone 2 — Description', page: 'about', type: 'text', default: { text: 'Expanded regional tournaments, supported college championships, and registered more teams across the region through active sports council coordination.' } },
  { key: 'about.milestone_3.year', label: 'Milestone 3 — Era Tag', page: 'about', type: 'text', default: { text: 'Excellence Era' } },
  { key: 'about.milestone_3.title', label: 'Milestone 3 — Title', page: 'about', type: 'text', default: { text: 'National Podium Success' } },
  { key: 'about.milestone_3.desc', label: 'Milestone 3 — Description', page: 'about', type: 'text', default: { text: 'Developed world-class athletes, established high-performance training centers in Pune, and secured competitive medal placement in National Championships.' } },
  { key: 'about.milestone_1.image', label: 'About Milestone 1 Image', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/milestone_1.jpg', alt: 'Milestone image' } },
  { key: 'about.milestone_2.image', label: 'About Milestone 2 Image', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/milestone_2.jpg', alt: 'Milestone image' } },
  { key: 'about.milestone_3.image', label: 'About Milestone 3 Image', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/milestone_3.jpg', alt: 'Milestone image' } },
  { key: 'about.gallery_1', label: 'About Gallery Image 1', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/gallery_1.jpg', alt: 'Sepaktakraw bicycle kick spike' } },
  { key: 'about.gallery_2', label: 'About Gallery Image 2', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/gallery_2.jpg', alt: 'Tekong high service kick' } },
  { key: 'about.gallery_3', label: 'About Gallery Image 3', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/gallery_3.jpg', alt: 'Roll spike over the net' } },
  { key: 'about.gallery_4', label: 'About Gallery Image 4', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/gallery_4.jpg', alt: 'Net defense block' } },
  { key: 'about.gallery_5', label: 'About Gallery Image 5', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/gallery_5.jpg', alt: 'Feeder setting the ball' } },
  { key: 'about.gallery_6', label: 'About Gallery Image 6', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/gallery_6.jpg', alt: 'Sunback spike execution' } },
  { key: 'about.gallery_7', label: 'About Gallery Image 7', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/gallery_7.jpg', alt: 'Team celebration and trophy' } },
  { key: 'about.gallery_8', label: 'About Gallery Image 8', page: 'about', type: 'image', shape: 'banner', default: { url: '/hero/hero-image.jpg', alt: 'Championship match action' } },


  // News -------------------------------------------------------------------
  { key: 'news.hero.image', label: 'News Hero Background', page: 'news', type: 'image', shape: 'banner', default: { url: '/hero/news_hero.jpg' } },
  { key: 'news.hero.title', label: 'News Hero Title', page: 'news', type: 'text', default: { text: 'Latest News' } },
  { key: 'news.hero.subtitle', label: 'News Hero Subtitle', page: 'news', type: 'text', default: { text: 'Updates from Maharashtra Sepaktakraw Association' } },

  // Browse pages -----------------------------------------------------------
  { key: 'teams.hero.image', label: 'Teams Hero Background', page: 'teams', type: 'image', shape: 'banner', default: { url: '/hero/teams_hero.jpg' } },
  { key: 'teams.hero.title', label: 'Teams Hero Title', page: 'teams', type: 'text', default: { text: 'Teams' } },
  { key: 'teams.hero.subtitle', label: 'Teams Hero Subtitle', page: 'teams', type: 'text', default: { text: 'Meet the competitive teams across Maharashtra' } },
  { key: 'players.hero.image', label: 'Players Hero Background', page: 'players', type: 'image', shape: 'banner', default: { url: '/hero/players_hero.jpg' } },
  { key: 'players.hero.title', label: 'Players Hero Title', page: 'players', type: 'text', default: { text: 'Players' } },
  { key: 'players.hero.subtitle', label: 'Players Hero Subtitle', page: 'players', type: 'text', default: { text: 'Discover elite Sepaktakraw athletes' } },
  { key: 'tournaments.hero.image', label: 'Tournaments Hero Background', page: 'tournaments', type: 'image', shape: 'banner', default: { url: '/hero/tournaments_hero.jpg' } },
  { key: 'tournaments.hero.title', label: 'Tournaments Hero Title', page: 'tournaments', type: 'text', default: { text: 'Tournaments' } },
  { key: 'tournaments.hero.subtitle', label: 'Tournaments Hero Subtitle', page: 'tournaments', type: 'text', default: { text: 'Explore upcoming, ongoing, and completed tournaments' } },

  // Contact ----------------------------------------------------------------
  { key: 'contact.hero.image', label: 'Contact Hero Background', page: 'contact', type: 'image', shape: 'banner', default: { url: '/hero/contact_hero.jpg', alt: 'Sepaktakraw action' } },
  { key: 'contact.hero.title', label: 'Contact Hero Title', page: 'contact', type: 'text', default: { text: 'Get in Touch' } },
  { key: 'contact.hero.subtitle', label: 'Contact Hero Subtitle', page: 'contact', type: 'text', default: { text: 'Questions, partnerships, or want to join a team? The Maharashtra Sepaktakraw Association is here.' } }
]

export const SETTINGS_DEFAULTS: SiteSettings = SETTING_DESCRIPTORS.reduce(
  (acc, d) => {
    acc[d.key] = d.default
    return acc
  },
  {} as SiteSettings,
)

export const SettingsManager = {
  getAll: async (): Promise<SiteSettings> => {
    return { ...SETTINGS_DEFAULTS, ...(siteContent as SiteSettings) }
  },

  get: async (key: string): Promise<SettingValue> => {
    const all = await SettingsManager.getAll()
    return all[key] ?? {}
  },

  set: async (_key: string, _value: SettingValue): Promise<void> => {
    throw new Error('Site settings are now statically configured in the codebase via JSON.')
  },
}

export function useSiteSettings() {
  const settings = { ...SETTINGS_DEFAULTS, ...(siteContent as SiteSettings) }

  const img = (key: string, fallback = '') => settings[key]?.url || fallback
  const alt = (key: string, fallback = '') => settings[key]?.alt || fallback
  const txt = (key: string, fallback = '') => settings[key]?.text || fallback

  return { settings, isLoaded: true, img, alt, txt }
}
