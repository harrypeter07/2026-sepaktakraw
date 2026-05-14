'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Trophy,
  Users2,
  UserCheck,
  Zap,
  BarChart3,
  FileText,
  Settings,
  X,
} from 'lucide-react'
import type { RoleType } from '@/lib/rbac-types'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  userRole: RoleType
}

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Users & Roles',
    href: '/admin/users',
    icon: Users,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Tournaments',
    href: '/admin/tournaments',
    icon: Trophy,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Teams',
    href: '/admin/teams',
    icon: Users2,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Players',
    href: '/admin/players',
    icon: UserCheck,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Match Scoring',
    href: '/admin/matches',
    icon: Zap,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: FileText,
    roles: ['super_admin'],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['super_admin'],
  },
]

export default function AdminSidebar({ isOpen, onClose, userRole }: AdminSidebarProps) {
  const pathname = usePathname()

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole))

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
          <h2 className="text-xl font-bold text-foreground">Admin Portal</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-muted rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredItems.map(item => {
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
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Logged in as:</p>
            <p className="truncate">{userRole}</p>
          </div>
        </div>
      </aside>
    </>
  )
}
