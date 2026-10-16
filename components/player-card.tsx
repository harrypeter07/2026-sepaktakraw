const POSITION_STYLES: Record<string, { badge: string; bg: string }> = {
  Tekong:  { badge: 'bg-amber-600 text-white',    bg: 'from-amber-950 to-amber-800' },
  Killer:  { badge: 'bg-rose-600 text-white',     bg: 'from-rose-950 to-rose-800' },
  Feeder:  { badge: 'bg-blue-600 text-white',     bg: 'from-blue-950 to-blue-800' },
  Spiker:  { badge: 'bg-red-600 text-white',      bg: 'from-red-900 to-red-700' },
  Setter:  { badge: 'bg-sky-600 text-white',      bg: 'from-sky-900 to-sky-700' },
  Blocker: { badge: 'bg-emerald-600 text-white',  bg: 'from-emerald-900 to-emerald-700' },
  Libero:  { badge: 'bg-purple-600 text-white',   bg: 'from-purple-900 to-purple-700' },
  default: { badge: 'bg-slate-600 text-white',    bg: 'from-slate-800 to-slate-600' },
}

interface PlayerCardProps {
  id: string
  name: string
  position: string
  team: string
  jerseyNumber: number
  height?: string
  weight?: string
  photoUrl?: string
  onViewProfile?: () => void
}

export function PlayerCard({
  id,
  name,
  position,
  team,
  jerseyNumber,
  height,
  weight,
  photoUrl,
  onViewProfile,
}: PlayerCardProps) {
  const style = POSITION_STYLES[position] || POSITION_STYLES.default
  // Per-record photo is set from the admin panel; absent one, a branded
  // gradient + initials avatar renders (no hardcoded stock imagery).
  const displayImage = photoUrl

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Photo area */}
      <div className={`relative h-52 w-full overflow-hidden bg-gradient-to-br ${style.bg} flex-shrink-0`}>
        {displayImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayImage}
            alt={name}
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-black text-white/30">{initials}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Jersey number badge */}
        <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-black text-lg shadow-lg">
          {jerseyNumber}
        </div>

        {/* Position badge */}
        <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg ${style.badge}`}>
          {position}
        </span>

        {/* Name on photo */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-black text-base leading-tight drop-shadow-lg">{name}</h3>
          <p className="text-white/70 text-xs font-semibold mt-0.5">{team}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="grid grid-cols-2 gap-3 mb-5 flex-1">
          {height && (
            <div className="text-center rounded-xl bg-slate-50 py-3">
              <div className="text-base font-black text-[#1e3a8a]">{height}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Height</div>
            </div>
          )}
          {weight && (
            <div className="text-center rounded-xl bg-slate-50 py-3">
              <div className="text-base font-black text-[#1e3a8a]">{weight}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Weight</div>
            </div>
          )}
        </div>

        <button
          onClick={onViewProfile}
          className="w-full rounded-xl bg-[#1e3a8a] py-3 text-sm font-bold text-white hover:bg-[#2563eb] transition-colors shadow-sm cursor-pointer"
        >
          View Profile
        </button>
      </div>
    </div>
  )
}
