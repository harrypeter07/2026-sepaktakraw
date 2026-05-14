'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { RBACManager } from '@/lib/rbac'
import type { RBACContext } from '@/lib/rbac-types'
import OfficialsSidebar from '@/components/officials/officials-sidebar'
import OfficialsHeader from '@/components/officials/officials-header'

export default function OfficialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user } = useAuth()
  const [rbac, setRbac] = useState<RBACContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        router.push('/auth/login')
        return
      }

      try {
        const context = await RBACManager.getUserRBACContext(user.id)
        
        // Check if user is district official or higher
        if (!context || (!context.roles.includes('district_official') && !context.is_admin)) {
          router.push('/')
          return
        }

        setRbac(context)
      } catch (error) {
        console.error('Error checking officials access:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!rbac || (!rbac.roles.includes('district_official') && !rbac.is_admin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don&apos;t have permission to access the officials portal.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <OfficialsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        rbac={rbac}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficialsHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} rbac={rbac} />

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
