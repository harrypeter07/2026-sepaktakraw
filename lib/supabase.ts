import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

// Browser client. Uses the `@supabase/ssr` cookie-based client so the session is
// stored in cookies and is therefore readable by Server Components, Route
// Handlers, and middleware. (The default `createClient` stores the session in
// localStorage only, which the server can never see — that mismatch is why the
// authenticated API routes previously always returned 401.)
//
// NOTE: server-only code must import `getServerSupabaseClient` from
// `lib/supabase-server.ts` instead. That module depends on `next/headers`, which
// cannot be bundled into client components, so it is kept in a separate file.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
