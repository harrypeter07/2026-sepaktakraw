-- Migration 005: Site-wide content settings (admin-editable images & text)
-- Maharashtra Sepaktakraw Association
--
-- A simple key/value store for site-wide content that admins can edit from the
-- /admin "Site Images" tab: hero backgrounds, section images, the site logo,
-- and a few hero text strings. Image URLs point at objects in the public
-- `media` bucket created in migration 004.

-- 1. Table --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,                       -- stable id, e.g. 'home.hero.image'
  value      JSONB NOT NULL DEFAULT '{}'::jsonb,     -- { url, alt, caption } | { text }
  type       TEXT NOT NULL DEFAULT 'image'           -- UI hint
             CHECK (type IN ('image', 'text')),
  label      TEXT,                                   -- human label for the admin UI
  page       TEXT,                                   -- group: home|about|news|teams|players|tournaments|global
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 2. Row level security -------------------------------------------------------
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read (the whole point — public pages render these values).
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

-- Admin-only writes. Reuses the recursion-safe is_admin() helper (migration 003).
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;
CREATE POLICY "Admins can delete site settings" ON public.site_settings
  FOR DELETE USING (public.is_admin());

-- 3. Seed ---------------------------------------------------------------------
-- ON CONFLICT DO NOTHING so re-running never clobbers admin edits. Empty `{}`
-- values fall back to the app's static defaults until an admin sets them.
INSERT INTO public.site_settings (key, type, label, page, value) VALUES
  -- Global
  ('site.logo',              'image', 'Site Logo',                  'global',      '{}'::jsonb),
  ('site.og_image',          'image', 'Social Share Image',         'global',      '{}'::jsonb),
  -- Homepage
  ('home.hero.image',        'image', 'Hero Background',            'home',        '{}'::jsonb),
  ('home.hero.title',        'text',  'Hero Title',                 'home',        '{"text":"Maharashtra Sepaktakraw"}'::jsonb),
  ('home.hero.subtitle',     'text',  'Hero Subtitle',              'home',        '{"text":"Excellence in Asian Kick-Volleyball Sport"}'::jsonb),
  ('home.about.image',       'image', 'About Section Image',        'home',        '{}'::jsonb),
  ('home.cta.image',         'image', 'CTA Background',             'home',        '{}'::jsonb),
  -- About
  ('about.hero.image',       'image', 'About Hero Background',      'about',       '{}'::jsonb),
  -- News
  ('news.hero.image',        'image', 'News Hero Background',       'news',        '{}'::jsonb),
  -- Browse pages
  ('teams.hero.image',       'image', 'Teams Hero Background',      'teams',       '{}'::jsonb),
  ('players.hero.image',     'image', 'Players Hero Background',    'players',     '{}'::jsonb),
  ('tournaments.hero.image', 'image', 'Tournaments Hero Background','tournaments', '{}'::jsonb)
ON CONFLICT (key) DO NOTHING;
