# Architecture Review & Improvements

This document records the architecture review of the Maharashtra Sepaktakraw
Association (MSA) web app and the changes made on top of it.

## 1. Architecture overview

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS v4, shadcn/ui (Radix primitives), OKLCH design tokens |
| Backend | Supabase (Postgres + Auth + Realtime + Storage) |
| Hosting | Vercel (`@vercel/analytics`) |

**Domain model:** `users` (roles: admin / tournament_manager / team_manager /
viewer) → `teams` → `players`; `tournaments` ↔ `tournament_teams` ↔ `matches` →
`match_sets`; plus `articles` and `audit_logs`.

### Data flow (two paths)

1. **Client manager** — `lib/data-manager.ts` calls the browser Supabase client
   directly, gated by `FEATURE_FLAGS.USE_SUPABASE`, with a localStorage fallback.
   Used by `/admin`, `/teams`, `/players`, `/tournaments`.
2. **Route handlers** — `app/api/*` use a server (cookie-based) Supabase client.
   Used by `/dashboard` and the `dashboard/create-*` pages.

### Authentication flow

`lib/auth-context.tsx` wraps the app, tracks the Supabase session, and lazily
creates a `public.users` profile row on first login. Role helpers (`isAdmin`,
etc.) drive UI gating. Server routes authorize with `auth.getUser()` + a role
lookup. **The public site exposes no login button** — the admin area is reached
by navigating to `/auth/login` manually, then `/admin` (admin-only, guarded).

### Database / RLS

`supabase/migrations/001..004`. RLS is enabled on every table; public read for
teams/players/tournaments/matches/published-articles, writes restricted to
owners/managers/admins.

## 2. Issues found & fixed

### Security
- **Service-role key exposure risk.** `.env` (containing
  `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS) was **not** covered by
  `.gitignore` (only `.env*.local` was). Added `.env` to `.gitignore`, added a
  safe `.env.example`. **Action required: rotate the service-role key** in the
  Supabase dashboard since it lived in a committable file.
- **RLS infinite recursion (`42P17`).** The `users` admin policies queried
  `users` from within a `users` policy → recursion that made the table
  unreadable. Fixed in `003` with a `SECURITY DEFINER public.is_admin()` helper.

### Correctness / bugs
- **Broken server auth.** `getServerSupabaseClient` called `cookies()`
  synchronously, but in Next 16 `cookies()` is async — the server never saw a
  session, so authenticated API POSTs always failed. Now awaited.
- **Auth cookie mismatch.** The browser used `createClient` (localStorage
  session), which the server can't read. Switched to `createBrowserClient`
  (cookie session) + added `middleware.ts` to refresh it. Server and client now
  share auth.
- **`TeamManager.update` ReferenceError.** localStorage branch referenced an
  undefined `tournaments` variable. Fixed to `teams`.
- **`ignoreBuildErrors: true`** masked all of the above. Disabled; the build now
  typechecks. Errors fixed in `match-scorer.tsx` and `players/page.tsx`.
- **Broken `&apos;` entities** in sample player heights rendered literally.
- **Dead `/contact` link** on the homepage → `/about`.

### Performance / quality
- `PlayerManager.getByTeam` filtered all players in JS → now filters in the DB
  via an inner join.
- `useRealtimeMatches` stored its channel in a `let` (reset each render) → now a
  `useRef`, so cleanup always removes the right channel.

## 3. New feature — image uploads (Supabase Storage)

- **`004_storage_and_images.sql`** creates a public `media` bucket (5 MB limit,
  image MIME types) with RLS (public read, authenticated write) and adds
  `tournaments.image_url`.
- **`components/image-upload.tsx`** — reusable uploader (preview, replace,
  remove, validation) used in all three admin forms.
- Wired end-to-end: admin forms → `data-manager` (`logoUrl` / `photoUrl` /
  `imageUrl` ↔ `logo_url` / `photo_url` / `image_url`) → public cards.
- Team / Player / Tournament cards redesigned to show the uploaded logo / photo /
  banner, with initials and gradient fallbacks when no image is set.

## 4. UI overhaul + site-wide image management

- **Theme** (`app/globals.css`): re-themed to a "bold sporty" look — deep navy
  base + electric-orange accent (OKLCH). `:root` is the rendered theme (no
  dark-mode toggle is wired). Added helper utilities: `.kicker`, `.clip-angle-b`,
  `.spotlight`, `.rise-in`.
- **Homepage** (`app/page.tsx`, now a client component): redesigned hero with
  angled edge + kicker, a live stats band (team/player/tournament counts),
  feature cards with accent hover, and an image-backed CTA band.
- **Interior pages**: new shared `components/page-hero.tsx` renders an
  admin-configurable background image with a navy overlay (about, news, teams,
  players, tournaments). `about` became a client component for this.
- **`005_site_settings.sql`** — a `key/value` (JSONB) `site_settings` table with
  public-read / admin-write RLS (reuses `public.is_admin()`), seeded with all
  page image + hero-text keys. Stores image URLs pointing at the `media` bucket.
- **`lib/site-settings.ts`** — `SettingsManager` (Supabase-first with static
  defaults fallback, `upsert` on save) + `useSiteSettings()` hook with
  `img()` / `txt()` / `alt()` helpers. Static `SETTINGS_DEFAULTS` keep every page
  rendering even before the migration is applied.
- **Admin "Site Images" tab** (`components/site-settings-manager.tsx`): a 4th tab
  in `/admin` that lists every setting grouped by page, each with the existing
  `ImageUpload` (folder `site`) + alt/text input and a per-item Save.
- **Inline admin login**: `components/login-card.tsx` (extracted from
  `/auth/login`) now also renders inline on `/admin` when signed out — no login
  button anywhere on the public site; `/admin` shows login → access-denied →
  dashboard branches instead of redirecting. The navbar logo is also
  admin-configurable via `site.logo`.

## 5. Setup / deployment steps

1. Copy `.env.example` → `.env.local` and fill real values. **Rotate the
   service-role key.**
2. Apply migrations in order: `001 → 002 → 003 → 004 → 005` (Supabase SQL editor
   or CLI). `003`, `004`, `005` are safe to re-run. **`005` is not auto-applied —
   the "Site Images" tab can't persist until it runs** (pages still render from
   static defaults until then).
3. `npm install && npm run dev`. Verify with `npm run typecheck` and
   `npm run build`.

## 6. Remaining / recommended next steps

- Migrate `middleware.ts` → `proxy.ts` (Next 16 deprecation; still works today).
- Unify the two data paths (client manager vs `/api`) onto one.
- Add automated tests (none exist yet) — Vitest + React Testing Library + an
  RLS/integration suite.
- Consider server-side validation with Zod (already a dependency) in the API
  routes, and pagination on list endpoints.
- Optional: serve hero images server-side for LCP (the manager split already
  supports adding a `site-settings-server.ts`).
