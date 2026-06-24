-- Migration 006: Form submissions for dynamic forms
-- Maharashtra Sepaktakraw Association

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id     TEXT NOT NULL,
  answers     JSONB NOT NULL DEFAULT '{}'::jsonb,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'read', 'archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Public can insert (contact submissions)
DROP POLICY IF EXISTS "Anyone can insert form submissions" ON public.form_submissions;
CREATE POLICY "Anyone can insert form submissions" ON public.form_submissions
  FOR INSERT WITH CHECK (true);

-- Admins can read, update, delete
DROP POLICY IF EXISTS "Admins can select form submissions" ON public.form_submissions;
CREATE POLICY "Admins can select form submissions" ON public.form_submissions
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update form submissions" ON public.form_submissions;
CREATE POLICY "Admins can update form submissions" ON public.form_submissions
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete form submissions" ON public.form_submissions;
CREATE POLICY "Admins can delete form submissions" ON public.form_submissions
  FOR DELETE USING (public.is_admin());
