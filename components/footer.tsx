'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Maharashtra Sepaktakraw</h3>
            <p className="text-primary-foreground opacity-80 text-sm leading-relaxed">
              Promoting excellence and growth in Sepaktakraw across Maharashtra through competitive tournaments and player development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="opacity-80 hover:opacity-100 transition">About Us</Link></li>
              <li><Link href="/tournaments" className="opacity-80 hover:opacity-100 transition">Tournaments</Link></li>
              <li><Link href="/teams" className="opacity-80 hover:opacity-100 transition">Teams</Link></li>
              <li><Link href="/players" className="opacity-80 hover:opacity-100 transition">Players</Link></li>
              <li><Link href="/news" className="opacity-80 hover:opacity-100 transition">News</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2 items-start">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="opacity-80">Maharashtra, India</span>
              </div>
              <div className="flex gap-2 items-start">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <span className="opacity-80">+91 (XXX) XXX-XXXX</span>
              </div>
              <div className="flex gap-2 items-start">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <span className="opacity-80">info@msa.org.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground opacity-20 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
          <p>&copy; 2025 Maharashtra Sepaktakraw Association. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:opacity-100 transition">Privacy Policy</Link>
            <Link href="#" className="hover:opacity-100 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
