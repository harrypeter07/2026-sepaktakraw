-- Migration 004: Image storage bucket + entity image columns
-- Maharashtra Sepaktakraw Association
--
-- Adds a single public storage bucket ("media") for all uploaded images shown on
-- the public website (team logos, player photos, tournament banners) and wires a
-- banner column onto tournaments (teams.logo_url and players.photo_url already
-- exist from migration 001).

-- 1. Missing image column -----------------------------------------------------
ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Public storage bucket ----------------------------------------------------
-- `public = true` makes object URLs readable without a signed token, which is
-- what the public-facing pages need. 5 MB per-file limit, images only.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Storage RLS policies -----------------------------------------------------
-- Anyone may read; only authenticated users may upload / change / remove.
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated upload media" ON storage.objects;
CREATE POLICY "Authenticated upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update media" ON storage.objects;
CREATE POLICY "Authenticated update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete media" ON storage.objects;
CREATE POLICY "Authenticated delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
