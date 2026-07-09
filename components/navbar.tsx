'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useSiteSettings } from '@/lib/site-settings'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { img, txt, isLoaded } = useSiteSettings()
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
    <nav className="sticky top-0 z-50 bg-white text-foreground border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            {!isLoaded ? (
              <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
            ) : logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="MSTA logo" className="h-10 w-10 rounded-full object-contain shadow-sm border border-border animate-in fade-in duration-300" />
            ) : (
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-sm">
                <span className="text-accent-foreground font-bold text-sm">MS</span>
              </div>
            )}
            <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-foreground leading-tight max-w-[150px] sm:max-w-none">
              {!isLoaded ? (
                <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
              ) : (
                txt('site.navbar_brand', 'Maharashtra Sepak Takraw Association')
              )}
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
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex gap-2 ml-4 border-l border-border pl-4">
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-md text-xs lg:text-sm font-extrabold uppercase tracking-wider text-muted-foreground hover:bg-slate-100 hover:text-foreground transition flex items-center gap-1.5"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-md text-xs lg:text-sm font-extrabold uppercase tracking-wider bg-accent text-accent-foreground hover:bg-accent/90 transition flex items-center gap-1.5"
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
            className="md:hidden p-2 rounded-md text-foreground hover:bg-slate-100 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm font-extrabold uppercase tracking-wider transition ${
                  isActive(link.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="border-t border-border pt-2 mt-2 space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-extrabold uppercase tracking-wider text-muted-foreground hover:bg-slate-100 hover:text-foreground transition"
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
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-extrabold uppercase tracking-wider bg-accent text-accent-foreground hover:bg-accent/90 transition"
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
