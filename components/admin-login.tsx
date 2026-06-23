'use client'

import { useRouter } from 'next/navigation'
import { LoginCard } from '@/components/login-card'

// Client login form for the dedicated /admin/login page. On success we navigate
// to /admin and refresh so the server gate re-runs its role check.
export function AdminLoginForm() {
  const router = useRouter()

  return (
    <LoginCard
      bare
      title="Administrator Sign-In"
      subtitle="Authenticate with your Supabase admin credentials to continue."
      onSuccess={() => {
        router.push('/admin')
        router.refresh()
      }}
    />
  )
}
