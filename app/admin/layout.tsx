import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSupabaseClient } from '@/lib/supabase-server'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { AdminSidebar } from '@/components/admin-sidebar'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (FEATURE_FLAGS.USE_SUPABASE) {
    const supabase = await getServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      redirect('/admin/login')
    }
    
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
                <Link href="/admin/login">Log in as Admin</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </>
      )
    }
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <AdminSidebar />
      
      {/* Workspace Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden pt-16 md:pt-0">
        {children}
      </div>
    </div>
  )
}
