import Link from 'next/link'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import { AdminDashboard } from '@/components/admin-dashboard'
import { getServerSupabaseClient } from '@/lib/supabase-server'
import { FEATURE_FLAGS } from '@/lib/feature-flags'

// Always evaluate auth per-request (this page reads the session cookie).
export const dynamic = 'force-dynamic'

/**
 * Server-side admin gate. The admin dashboard markup and data are only ever
 * rendered after the server has confirmed (a) a signed-in user and (b) the
 * 'admin' role in public.users. An unauthenticated or non-admin visitor never
 * receives the admin UI — this is the real security boundary, enforced before
 * anything reaches the browser. Mutations are independently protected by
 * Supabase RLS (public.is_admin()).
 */
export default async function AdminPage() {
  // Local dev mode without Supabase: skip auth and show the dashboard.
  if (!FEATURE_FLAGS.USE_SUPABASE) {
    return <AdminDashboard />
  }

  const supabase = await getServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Not signed in → send them to the dedicated admin login page.
  if (!user) {
    redirect('/admin/login')
  }

  // Signed in → verify the admin role server-side.
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-20 text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">Access Denied</h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Your account doesn’t have administrator permissions. If you believe this is a
            mistake, contact a site administrator.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return <AdminDashboard />
}
