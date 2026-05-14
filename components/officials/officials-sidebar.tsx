'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  Trophy,
  Zap,
  Users2,
  UserCheck,
  BarChart3,
  X,
} from 'lucide-react'
import type { RBACContext } from '@/lib/rbac-types'

interface OfficialsSidebarProps {
  isOpen: boolean
  onClose: () => void
  rbac: RBACContext
}

const menuItems = [
  {
    label: 'Dashboard',
    href: '/officials',
    icon: LayoutDashboard,
  },
  {
    label: 'My District',
    href: '/officials/district',
    icon: MapPin,
  },
  {
    label: 'Tournaments',
    href: '/officials/tournaments',
    icon: Trophy,
  },
  {
    label: 'Match Scoring',
    href: '/officials/matches',
    icon: Zap,
  },
  {
    label: 'Teams',
    href: '/officials/teams',
    icon: Users2,
  },
  {
    label: 'Players',
    href: '/officials/players',
    icon: UserCheck,
  },
  {
    label: 'Reports',
    href: '/officials/reports',
    icon: BarChart3,
  },
]

export default function OfficialsSidebar({ isOpen, onClose, rbac }: OfficialsSidebarProps) {
  const pathname = usePathname()

  const districtName = rbac.scope_district_id ? 'Your District' : 'Maharashtra'

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-64 h-screen bg-card border-r border-border flex flex-col transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Officials</h2>
            <p className="text-xs text-muted-foreground mt-1">{districtName}</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-muted rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Role:</p>
          <p className="truncate">{rbac.roles[0].replace(/_/g, ' ')}</p>
        </div>
      </aside>
    </>
  )
}
