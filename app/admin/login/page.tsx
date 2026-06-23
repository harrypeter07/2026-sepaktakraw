import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { AdminLoginForm } from '@/components/admin-login'
import { getServerSupabaseClient } from '@/lib/supabase-server'
import { FEATURE_FLAGS } from '@/lib/feature-flags'

export const dynamic = 'force-dynamic'

// Dedicated admin login. This is the only place the sign-in form is surfaced for
// admins — /admin redirects here when there is no admin session. If an admin is
// already signed in, skip the form and go straight to the dashboard.
export default async function AdminLoginPage() {
  if (FEATURE_FLAGS.USE_SUPABASE) {
    const supabase = await getServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role === 'admin') redirect('/admin')
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 -z-10 spotlight" />
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            SK
          </span>
          MSA
        </Link>

        <div>
          <span className="kicker mb-5">Control Center</span>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight text-balance">
            Maharashtra Sepaktakraw Association
          </h2>
          <p className="mt-4 max-w-sm text-primary-foreground/80">
            Manage tournaments, teams, players and site imagery from one secure dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
          <ShieldCheck className="h-4 w-4 text-accent" />
          Protected area · authorized administrators only
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex flex-col items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>

          <div className="rounded-xl border border-border bg-card p-8 shadow-2xl">
            <AdminLoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Credentials are verified against Supabase Auth. Accounts without the{' '}
            <code className="rounded bg-muted px-1 py-0.5">admin</code> role cannot access this area.
          </p>
        </div>
      </section>
    </main>
  )
}
