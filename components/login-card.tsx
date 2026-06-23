'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { Lock, Eye, EyeOff, Mail } from 'lucide-react'

interface LoginCardProps {
  /** Called after a successful sign-in. If omitted, the page just re-renders
   *  on the resulting auth-state change. */
  onSuccess?: () => void
  title?: string
  subtitle?: string
  /** Render without the outer card chrome (when the parent supplies its own). */
  bare?: boolean
}

export function LoginCard({
  onSuccess,
  title = 'Welcome Back',
  subtitle = 'Sign in to your account',
  bare = false,
}: LoginCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await signIn(email, password)
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const inner = (
    <>
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <Lock className="h-6 w-6" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">{title}</h1>
      <p className="mb-6 text-muted-foreground">{subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </>
  )

  if (bare) return <div className="w-full">{inner}</div>

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-border bg-card p-8 shadow-2xl">{inner}</div>
    </div>
  )
}
