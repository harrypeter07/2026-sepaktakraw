'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useSiteSettings } from '@/lib/site-settings'
import { getCdnUrl } from '@/lib/cdn-image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { img, isLoaded } = useSiteSettings()
  const pathname = usePathname()
  const logo = img('site.logo')

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: 'Teams', href: '/teams' },
    { label: 'Players', href: '/players' },
    { label: 'Districts', href: '/districts' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href))

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            {!isLoaded ? (
              <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
            ) : logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getCdnUrl(logo)} alt="MSTA logo" className="h-10 w-10 rounded-full object-contain shadow-sm border border-slate-200 animate-in fade-in duration-300" />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">MS</span>
              </div>
            )}
            <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 leading-tight max-w-[150px] sm:max-w-none">
              Maharashtra Sepaktakraw Association
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-xs lg:text-sm font-extrabold uppercase tracking-wider transition ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex gap-2 ml-4 border-l border-slate-200 pl-4">
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-md text-xs lg:text-sm font-extrabold uppercase tracking-wider text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-md text-xs lg:text-sm font-extrabold uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 bg-white">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm font-extrabold uppercase tracking-wider transition ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-extrabold uppercase tracking-wider text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-extrabold uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
