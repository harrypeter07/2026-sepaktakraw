'use client'

import { useRouter } from 'next/navigation'
import { LoginCard } from '@/components/login-card'

export default function LoginPage() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <LoginCard onSuccess={() => router.push('/')} />
    </main>
  )
}
