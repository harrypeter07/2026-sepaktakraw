import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

const url: string = supabaseUrl;
const anonKey: string = supabaseAnonKey;

// Server-side authenticated client for Route Handlers / Server Components.
// In Next.js 15+/16 `cookies()` is async and MUST be awaited — the previous
// synchronous `cookies().getAll()` returned a Promise with no `getAll`, so the
// server never saw the user's session.
export async function getServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // `setAll` was called from a Server Component, where cookies are
          // read-only. Safe to ignore — middleware refreshes the session.
        }
      },
    },
  });
}
