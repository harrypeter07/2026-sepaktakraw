-- =============================================================================
-- Promote a user to ADMIN
-- Maharashtra Sepaktakraw Association
-- =============================================================================
--
-- There is NO admin seeded by default — every account starts as 'viewer'.
-- This script grants the 'admin' role (which unlocks /admin, the Site Images
-- manager, and all admin-only RLS write policies via public.is_admin()).
--
-- HOW TO USE
-- 1. First create the login in the Supabase Dashboard:
--      Authentication → Users → "Add user" → set email + password
--      → tick "Auto Confirm User" → Create.
--    (This fires the handle_new_user() trigger and inserts a public.users row.)
-- 2. Replace the THREE occurrences of 'youradmin@example.com' below with YOUR
--    admin email (use Find & Replace).
-- 3. Run this whole file in the Supabase SQL Editor (raw SQL — no psql needed).
-- 4. Sign in at /admin with that email + password.
--
-- Idempotent and safe to re-run.
-- =============================================================================

-- 1. Promote the existing profile row to admin (and ensure it's active).
UPDATE public.users
SET role = 'admin',
    is_active = true,
    updated_at = now()
WHERE email = 'admin@msa.com';

-- 2. Safety net: if the profile row doesn't exist yet (e.g. the signup trigger
--    didn't run), create it from the matching auth.users record as an admin.
INSERT INTO public.users (id, email, full_name, role, is_active)
SELECT au.id,
       au.email,
       coalesce(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
       'admin',
       true
FROM auth.users au
WHERE au.email = 'admin@msa.com'
ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      is_active = true,
      updated_at = now();

-- 3. Verify — should return one row with role = 'admin'.
SELECT id, email, full_name, role, is_active
FROM public.users
WHERE email = 'admin@msa.com';
