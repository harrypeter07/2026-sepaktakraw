-- Migration 002: Fix RLS Policies and Schema Gaps
-- Maharashtra Sepaktakraw Association

-- 1. Schema Extensions: Add missing columns to match client-side model requirements
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS coach TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS weight TEXT;

-- 2. Automatic User Profile Trigger
-- Automatically create a profile in public.users when a user signs up or is created in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_active)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'viewer',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it already exists, then create it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. public.users Policies Fix
-- Allow users to insert their own profile (in case trigger is skipped or fails)
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. public.teams Policies Fix
-- Allow admins to delete teams
CREATE POLICY "Admins can delete teams" ON public.teams
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. public.players Policies Fix
-- Allow team managers and admins to update players
CREATE POLICY "Team managers and admins can update players" ON public.players
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND manager_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow team managers and admins to delete players
CREATE POLICY "Team managers and admins can delete players" ON public.players
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND manager_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. public.tournaments Policies Fix
-- Allow tournament managers and admins to delete tournaments
CREATE POLICY "Tournament managers and admins can delete tournaments" ON public.tournaments
  FOR DELETE USING (
    auth.uid() = manager_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. public.matches Policies Fix
-- Allow tournament managers and admins to update matches
CREATE POLICY "Tournament managers and admins can update matches" ON public.matches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.tournaments 
      WHERE id = tournament_id AND manager_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow tournament managers and admins to delete matches
CREATE POLICY "Tournament managers and admins can delete matches" ON public.matches
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.tournaments 
      WHERE id = tournament_id AND manager_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. public.match_sets Policies Fix
-- Allow anyone to read match sets
CREATE POLICY "Anyone can view match sets" ON public.match_sets
  FOR SELECT USING (true);

-- Allow tournament managers and admins to insert, update, and delete match sets
CREATE POLICY "Tournament managers and admins can insert match sets" ON public.match_sets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.tournaments t ON t.id = m.tournament_id
      WHERE m.id = match_id AND (t.manager_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "Tournament managers and admins can update match sets" ON public.match_sets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.tournaments t ON t.id = m.tournament_id
      WHERE m.id = match_id AND (t.manager_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "Tournament managers and admins can delete match sets" ON public.match_sets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.tournaments t ON t.id = m.tournament_id
      WHERE m.id = match_id AND (t.manager_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- 9. public.articles Policies Fix
-- Allow authenticated users to insert articles
CREATE POLICY "Authenticated users can insert articles" ON public.articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authors and admins to update articles
CREATE POLICY "Authors and admins can update articles" ON public.articles
  FOR UPDATE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow authors and admins to delete articles
CREATE POLICY "Authors and admins can delete articles" ON public.articles
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 10. public.audit_logs Policies Fix
-- Allow admins to view audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
