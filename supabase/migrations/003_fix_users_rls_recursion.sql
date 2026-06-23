-- Migration 003: Fix infinite recursion in RLS policies
-- Maharashtra Sepaktakraw Association
--
-- PROBLEM
-- The policies "Admins can view all users" and "Admins can update any user"
-- (migration 001) run `SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'`
-- *inside* a policy that is itself attached to the `users` table. Postgres must
-- evaluate the users-table policy to run that sub-SELECT, which re-triggers the
-- same policy -> error 42P17 "infinite recursion detected in policy for relation
-- users". This makes the entire `users` table unreadable, which in turn breaks
-- profile loading, role checks, and every other policy that joins to `users`.
--
-- FIX
-- Move the admin check into a SECURITY DEFINER function. Because the function
-- runs with the definer's privileges it bypasses RLS when it reads `users`, so
-- there is no recursion. All admin policies are rewritten to call it.

-- 1. Recursion-free admin check ------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- 2. Rebuild the recursive users-table policies --------------------------------
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update any user" ON public.users
  FOR UPDATE USING (public.is_admin());

-- 3. Rebuild other policies to use is_admin() (consistency + avoids repeated
--    correlated sub-selects against users in every check).
DROP POLICY IF EXISTS "Team managers and admins can update teams" ON public.teams;
CREATE POLICY "Team managers and admins can update teams" ON public.teams
  FOR UPDATE USING (auth.uid() = manager_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can delete teams" ON public.teams;
CREATE POLICY "Admins can delete teams" ON public.teams
  FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Team managers and admins can create players" ON public.players;
CREATE POLICY "Team managers and admins can create players" ON public.players
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND manager_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Team managers and admins can update players" ON public.players;
CREATE POLICY "Team managers and admins can update players" ON public.players
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND manager_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Team managers and admins can delete players" ON public.players;
CREATE POLICY "Team managers and admins can delete players" ON public.players
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND manager_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Tournament managers and admins can update" ON public.tournaments;
CREATE POLICY "Tournament managers and admins can update" ON public.tournaments
  FOR UPDATE USING (auth.uid() = manager_id OR public.is_admin());

DROP POLICY IF EXISTS "Tournament managers and admins can delete tournaments" ON public.tournaments;
CREATE POLICY "Tournament managers and admins can delete tournaments" ON public.tournaments
  FOR DELETE USING (auth.uid() = manager_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());
