import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')
);

// Browser client. Uses the `@supabase/ssr` cookie-based client so the session is
// stored in cookies and is therefore readable by Server Components, Route
// Handlers, and middleware.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

