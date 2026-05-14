'use client'

import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: 'Teams', href: '/teams' },
    { label: 'Players', href: '/players' },
    { label: 'News', href: '/news' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold">SK</span>
            </div>
            <span className="hidden sm:inline">MSA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 ml-4 border-l border-primary-foreground pl-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition flex items-center gap-1"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-3 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-primary-foreground hover:text-primary transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-primary-foreground pt-2 mt-2 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
