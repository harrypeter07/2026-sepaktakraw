const POSITION_STYLES: Record<string, { badge: string; bg: string; accent: string; text: string }> = {
  Tekong:  { badge: 'bg-amber-500 text-white border-amber-400',   bg: 'from-amber-950 via-amber-900 to-amber-800', accent: 'text-amber-300', text: 'Server / Back' },
  Killer:  { badge: 'bg-rose-500 text-white border-rose-400',    bg: 'from-rose-950 via-rose-900 to-rose-800',   accent: 'text-rose-300',  text: 'Acrobatic Spiker' },
  Feeder:  { badge: 'bg-blue-600 text-white border-blue-400',    bg: 'from-blue-950 via-blue-900 to-blue-800',   accent: 'text-blue-300',  text: 'Setter / Playmaker' },
  Striker: { badge: 'bg-rose-500 text-white border-rose-400',    bg: 'from-rose-950 via-rose-900 to-rose-800',   accent: 'text-rose-300',  text: 'Acrobatic Spiker' },
  Spiker:  { badge: 'bg-rose-500 text-white border-rose-400',    bg: 'from-rose-950 via-rose-900 to-rose-800',   accent: 'text-rose-300',  text: 'Acrobatic Spiker' },
  Setter:  { badge: 'bg-blue-600 text-white border-blue-400',    bg: 'from-blue-950 via-blue-900 to-blue-800',   accent: 'text-blue-300',  text: 'Setter / Playmaker' },
  default: { badge: 'bg-slate-600 text-white border-slate-400',   bg: 'from-slate-900 via-slate-800 to-slate-700',   accent: 'text-slate-300', text: 'State Athlete' },
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

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Only render a photo if it is a verified custom upload (not duplicate stock placeholders)
  const isCustomVerifiedPhoto =
    Boolean(photoUrl) &&
    !photoUrl?.includes('/players/') &&
    !photoUrl?.includes('/hero/') &&
    !photoUrl?.includes('placeholder')

  return (
    <div className="group overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Varsity Athlete Header */}
      <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${style.bg} flex-shrink-0 flex flex-col justify-between p-4`}>
        {/* Subtle geometric court pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border border-white/15 pointer-events-none" />

        {isCustomVerifiedPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105 z-0"
          />
        ) : null}

        {/* Top Badges: Jersey & Position */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/35 backdrop-blur-md border border-white/20 text-white font-black text-xs shadow-sm">
            <span className="text-white/60 text-[10px] uppercase font-bold">No.</span>
            <span>{jerseyNumber || '—'}</span>
          </div>

          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm border ${style.badge}`}>
            {position}
          </span>
        </div>

        {/* Center: Athletic Crest Monogram (when no verified individual photo) */}
        {!isCustomVerifiedPhoto && (
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 shadow-lg flex items-center justify-center ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl font-black text-white tracking-wider drop-shadow-md">
                {initials}
              </span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 drop-shadow ${style.accent}`}>
              {style.text}
            </span>
          </div>
        )}

        {/* Bottom Banner: Name & Team */}
        <div className="relative z-10 mt-auto pt-2">
          <h3 className="text-white font-black text-base leading-snug drop-shadow-md truncate">
            {name}
          </h3>
          <p className="text-white/80 text-xs font-semibold truncate drop-shadow-sm">
            {team}
          </p>
        </div>
      </div>

      {/* Metrics & Action Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2.5 mb-4 flex-1">
          <div className="text-center rounded-xl bg-slate-50 border border-slate-100 py-2.5 px-2">
            <div className="text-sm font-black text-[#1e3a8a]">{height || '5\'10"'}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Height</div>
          </div>
          <div className="text-center rounded-xl bg-slate-50 border border-slate-100 py-2.5 px-2">
            <div className="text-sm font-black text-[#1e3a8a]">{weight || '70 kg'}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Weight</div>
          </div>
        </div>

        <button
          onClick={onViewProfile}
          className="w-full rounded-xl bg-[#1e3a8a] py-2.5 text-xs font-bold text-white hover:bg-[#2563eb] active:scale-[0.99] transition-all shadow-sm cursor-pointer"
        >
          View Profile & Stats
        </button>
      </div>
    </div>
  )
}
