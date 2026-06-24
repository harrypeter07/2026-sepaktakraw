'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { 
  Trophy, Users, User, FileText, MessageSquare, Settings, 
  Image, Menu, ShieldCheck, ChevronRight, LogOut, X 
} from 'lucide-react'

export function AdminSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navItems = [
    { id: 'tournaments', label: 'Tournaments', href: '/admin/tournaments', icon: Trophy },
    { id: 'teams', label: 'Teams', href: '/admin/teams', icon: Users },
    { id: 'players', label: 'Players', icon: User, href: '/admin/players' },
    { id: 'forms', label: 'Form Builder', icon: FileText, href: '/admin/forms' },
    { id: 'responses', label: 'Form Responses', icon: MessageSquare, href: '/admin/responses' },
    { id: 'site', label: 'Site Content', icon: Settings, href: '/admin/site' },
    { id: 'media', label: 'Media Gallery', icon: Image, href: '/admin/media' },
  ] as const

  const isActive = (href: string) => pathname?.startsWith(href)

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-6 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setOpen(true)} 
            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 border shrink-0"
          >
            <Menu size={20} />
          </button>
          <h2 className="font-bold text-slate-800 text-lg leading-none">MSA Admin</h2>
        </div>
        <Link 
          href="/" 
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 transition"
        >
          Website
        </Link>
      </div>

      {/* Main Sidebar Element */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-slate-900 text-slate-100 w-64 border-r border-slate-800 transition-all duration-300 transform md:relative md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-base leading-none">MSA Panel</h2>
              <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase mt-1 block">Management Panel</span>
            </div>
          </div>
          <button 
            onClick={() => setOpen(false)} 
            className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  active 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={12} className={active ? 'text-blue-300' : 'text-slate-600'} />
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 space-y-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate text-slate-100">{user?.email?.split('@')[0] || 'Administrator'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@msa.org.in'}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-red-950/30 hover:text-red-400 text-sm font-bold rounded-lg text-slate-300 hover:bg-slate-700 transition"
          >
            <LogOut size={16} /> 
            Logout Panel
          </button>
        </div>
      </aside>
    </>
  )
}
