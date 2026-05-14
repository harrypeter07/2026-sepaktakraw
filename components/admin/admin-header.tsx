'use client'

import { useAuth } from '@/lib/auth-context'
import { Menu, LogOut } from 'lucide-react'

interface AdminHeaderProps {
  onToggleSidebar: () => void
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Toggle button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 hover:bg-muted rounded-md transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-foreground" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User menu */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>

              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition text-foreground"
                aria-label="Logout"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
