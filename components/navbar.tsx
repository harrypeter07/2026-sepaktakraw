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
  const { img, txt } = useSiteSettings()
  const pathname = usePathname()
  const logo = img('site.logo')

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: 'Teams', href: '/teams' },
    { label: 'Players', href: '/players' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href))

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="MSA logo" className="h-9 w-9 rounded-lg object-cover shadow-sm" />
            ) : (
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-accent-foreground font-bold">SK</span>
              </div>
            )}
            <span className="hidden sm:inline">{txt('site.navbar_brand', 'MSA')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'bg-primary-foreground/15 text-primary-foreground'
                    : 'text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex gap-2 ml-4 border-l border-primary-foreground/30 pl-4">
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10 transition flex items-center gap-1.5"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition flex items-center gap-1.5"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-md hover:bg-primary-foreground/10 transition"
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
                className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'bg-primary-foreground/15'
                    : 'hover:bg-primary-foreground/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="border-t border-primary-foreground/20 pt-2 mt-2 space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10 transition"
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
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition"
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
