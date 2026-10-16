'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { useSiteSettings } from '@/lib/site-settings'
import { getCdnUrl } from '@/lib/cdn-image'

export default function Footer() {
  const { img, txt } = useSiteSettings()

  const officialAffiliations = [
    {
      name: 'Sepaktakraw Federation of India',
      short: 'STFI',
      url: getCdnUrl(img('site.footer_logo_1') || '/official/stfi-logo.png'),
    },
    {
      name: 'Asian Sepaktakraw Federation',
      short: 'ASTAF',
      url: getCdnUrl(img('site.footer_logo_2') || '/official/astaf-logo.jpg'),
    },
    {
      name: 'International Sepaktakraw Federation',
      short: 'ISTAF',
      url: getCdnUrl(img('site.footer_logo_3') || '/official/istaf-logo.jpg'),
    },
    {
      name: 'Sports Authority of India',
      short: 'SAI',
      url: getCdnUrl(img('site.footer_logo_4') || '/official/sai-logo.png'),
    },
    {
      name: 'Fit India Movement',
      short: 'Fit India',
      url: getCdnUrl(img('site.footer_logo_5') || '/official/fit-india.jpg'),
    },
    {
      name: 'Khelo India',
      short: 'Khelo India',
      url: getCdnUrl(img('site.footer_logo_6') || '/official/khelo-india.jpg'),
    },
    {
      name: 'National Anti-Doping Agency',
      short: 'NADA',
      url: getCdnUrl(img('site.footer_logo_7') || '/official/nada-logo.jpg'),
    },
  ]

  return (
    <footer className="bg-slate-950 text-slate-100 py-12 sm:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Affiliations & Recognition Showcase */}
        <div className="mb-12 pb-10 border-b border-slate-800/80">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldCheck size={16} className="text-blue-500" />
            <span className="text-xs uppercase font-black tracking-widest text-slate-400 text-center">
              Affiliated Governing Bodies & National Partners
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 items-center">
            {officialAffiliations.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/95 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:scale-[1.03] transition duration-200 border border-slate-200/20 group h-20"
                title={item.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name}
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                  className="h-10 w-full object-contain filter group-hover:brightness-105 transition"
                />
                <span className="text-[10px] font-bold text-slate-700 tracking-tight text-center leading-none truncate max-w-full">
                  {item.short}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* About */}
          <div>
            <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2.5 text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getCdnUrl('/msta-logo.png')}
                alt="MSTA logo"
                className="h-8 w-8 rounded-lg object-contain bg-white/10 p-0.5"
              />
              {txt('site.footer_title', 'Maharashtra Sepaktakraw')}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed text-balance">
              {txt(
                'site.footer_desc',
                'The apex state governing body for Sepaktakraw in Maharashtra. Legally registered under Reg. No. MAHARASHTRA/910/98 (Nagpur), affiliated with Sepaktakraw Federation of India (STFI) & recognized by Maharashtra Olympic Association.'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-extrabold mb-4 uppercase tracking-wider text-slate-200">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white transition">
                    About MSTA
                  </Link>
                </li>
                <li>
                  <Link href="/tournaments" className="text-slate-400 hover:text-white transition">
                    Tournaments
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="text-slate-400 hover:text-white transition">
                    State Squad
                  </Link>
                </li>
                <li>
                  <Link href="/players" className="text-slate-400 hover:text-white transition">
                    Athletes Registry
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <Link href="/districts" className="text-slate-400 hover:text-white transition">
                    District Units
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-slate-400 hover:text-white transition">
                    Official News
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-slate-400 hover:text-white transition">
                    Official Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-extrabold mb-4 uppercase tracking-wider text-slate-200">
              State Headquarters
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex gap-2.5 items-start">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-blue-400" />
                <span className="text-xs leading-relaxed">
                  {txt(
                    'site.footer_contact_address',
                    'MSTA 152-Firefox, Kamdar Bhavan, Pt. Malviya Road, Sitabuldi, Nagpur - 440012, Maharashtra, India'
                  )}
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <Phone size={16} className="mt-1 flex-shrink-0 text-blue-400" />
                <span className="text-xs font-semibold">
                  {txt('site.footer_contact_phone', '+91 94221 10610 / +91 93731 03328')}
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <Mail size={16} className="mt-1 flex-shrink-0 text-blue-400" />
                <span className="text-xs font-semibold">
                  {txt('site.footer_contact_email', 'MSTASecretary2021@gmail.com')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            &copy; {txt('site.footer_copyright', '2026 Maharashtra Sepaktakraw Association. All rights reserved.')}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
