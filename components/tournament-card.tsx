import { Trophy, MapPin, Calendar } from 'lucide-react'

interface TournamentCardProps {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  status: 'upcoming' | 'ongoing' | 'completed'
  teamsCount: number
  imageUrl?: string
  onViewDetails?: () => void
}

const STATUS_STYLES = {
  upcoming: 'bg-blue-600 text-white',
  ongoing: 'bg-emerald-500 text-white',
  completed: 'bg-slate-700 text-white',
}

export function TournamentCard({
  id,
  name,
  startDate,
  endDate,
  location,
  status,
  teamsCount,
  imageUrl,
  onViewDetails,
}: TournamentCardProps) {
  // Per-record image is set from the admin panel; absent one, the branded
  // gradient banner (with the title overlaid) renders — no hardcoded imagery.
  const displayImage = imageUrl

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Image Banner */}
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex-shrink-0">
        {displayImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayImage}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
        )}
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-3 right-3 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg ${STATUS_STYLES[status]}`}>
          {status}
        </span>

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-black text-lg leading-tight line-clamp-2 drop-shadow-lg">
            {name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-2.5 mb-5 flex-1">
          <div className="flex items-center gap-2.5 text-slate-500 text-sm">
            <Calendar size={14} className="text-[#2563eb] shrink-0" />
            <span>{startDate} — {endDate}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-sm">
            <MapPin size={14} className="text-[#2563eb] shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-sm">
            <Trophy size={14} className="text-[#2563eb] shrink-0" />
            <span className="font-semibold text-slate-700">{teamsCount} teams participating</span>
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="w-full rounded-xl bg-[#1e3a8a] py-3 text-sm font-bold text-white hover:bg-[#2563eb] transition-colors shadow-sm cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
