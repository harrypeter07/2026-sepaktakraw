import { Users, MapPin, Calendar } from 'lucide-react'
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
  const color = TEAM_COLORS[parseInt(id || '0') % TEAM_COLORS.length]

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Banner — branded gradient with a subtle court-grid texture */}
      <div className={`relative h-36 w-full overflow-hidden bg-gradient-to-br ${color} flex-shrink-0`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Logo circle — overlaps banner */}
      <div className="relative flex justify-center -mt-8 mb-3 z-10">
        <div className="h-16 w-16 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0">
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
        <h3 className="text-center text-lg font-black text-[#0A0F1E] leading-tight mb-4">{name}</h3>

        <div className="space-y-2.5 mb-5 flex-1">
          <div className="flex items-center gap-2.5 text-slate-500 text-sm">
            <MapPin size={14} className="text-[#2563eb] shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-sm">
            <Users size={14} className="text-[#2563eb] shrink-0" />
            <span className="font-semibold text-slate-700">{playerCount} players</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-sm">
            <Calendar size={14} className="text-[#2563eb] shrink-0" />
            <span>Est. {established}</span>
          </div>
          <div className="text-slate-500 text-sm border-t border-slate-100 pt-2.5 mt-2.5">
            <span className="text-slate-400 font-medium">Coach:</span>{' '}
            <span className="font-bold text-slate-700">{coach}</span>
          </div>
        </div>

        <button
          onClick={onViewRoster}
          className="w-full rounded-xl bg-[#1e3a8a] py-3 text-sm font-bold text-white hover:bg-[#2563eb] transition-colors shadow-sm cursor-pointer"
        >
          View Roster
        </button>
      </div>
    </div>
  )
}
