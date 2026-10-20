import { Users, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { getCdnUrl } from '@/lib/cdn-image'

interface TeamCardProps {
  id: string
  name: string
  location: string
  coach: string
  playerCount: number
  established: string
  logoUrl?: string
  onViewRoster?: () => void
}

const TEAM_COLORS = [
  'from-[#1e3a8a] to-[#2563eb]',
  'from-emerald-900 to-emerald-600',
  'from-red-900 to-red-600',
  'from-purple-900 to-purple-600',
  'from-amber-900 to-amber-600',
]

const TEAM_BANNERS: Record<string, string> = {
  'team-nagpur': '/hero/tournaments_hero.jpg',
  'team-solapur': '/hero/gallery_4.jpg',
  'team-nanded': '/hero/gallery_2.jpg',
  'team-wardha': '/hero/gallery_1.jpg',
  'team-nashik': '/hero/gallery_3.jpg',
  'team-jalgaon': '/hero/gallery_6.jpg',
  'team-csn': '/hero/gallery_5.jpg',
  'team-amravati': '/hero/gallery_7.jpg',
  'team-pune': '/hero/about_hero.jpg',
  'team-mumbai-suburban': '/hero/teams_hero.jpg',
  'team-gondia': '/hero/gallery_1.jpg',
  'team-kolhapur': '/hero/gallery_2.jpg',
}

export function TeamCard({
  id,
  name,
  location,
  coach,
  playerCount,
  established,
  logoUrl,
  onViewRoster,
}: TeamCardProps) {
  const hash = Array.from(id || name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const color = TEAM_COLORS[hash % TEAM_COLORS.length]
  const bannerImg = TEAM_BANNERS[id] || `/hero/gallery_${(hash % 7) + 1}.jpg`

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="group overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Banner — Regional sports stadium action image with district brand overlay */}
      <div className={`relative h-36 w-full overflow-hidden bg-gradient-to-br ${color} flex-shrink-0`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getCdnUrl(bannerImg)}
          alt={`${name} home court`}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.72] group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Logo circle — overlaps banner */}
      <div className="relative flex justify-center -mt-9 mb-3 z-10">
        <div className="h-16 w-16 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getCdnUrl(logoUrl)} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${color}`}>
              <span className="text-white font-black text-lg">{initials}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5">
        <h3 className="text-center text-lg font-black text-slate-900 leading-tight mb-4">{name}</h3>

        <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center gap-2.5 text-slate-600 text-sm">
            <MapPin size={14} className="text-[#2563eb] shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600 text-sm">
            <Users size={14} className="text-[#2563eb] shrink-0" />
            <span className="font-semibold text-slate-800">{playerCount} players</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-sm">
            <Calendar size={14} className="text-[#2563eb] shrink-0" />
            <span>Est. {established}</span>
          </div>
          <div className="text-slate-500 text-sm border-t border-slate-100 pt-2.5 mt-2.5">
            <span className="text-slate-400 font-medium">Head Coach:</span>{' '}
            <span className="font-bold text-slate-800">{coach}</span>
          </div>
        </div>

        <button
          onClick={onViewRoster}
          className="w-full rounded-xl bg-[#1e3a8a] py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#2563eb] active:scale-[0.99] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>View Players & Squad</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
