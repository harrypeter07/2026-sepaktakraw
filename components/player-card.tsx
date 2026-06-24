import { Card } from '@/components/ui/card'

interface PlayerCardProps {
  id: string
  name: string
  position: string
  team: string
  jerseyNumber: number
  height?: string
  weight?: string
  photoUrl?: string
}

export function PlayerCard({
  name,
  position,
  team,
  jerseyNumber,
  height,
  weight,
  photoUrl,
}: PlayerCardProps) {
  const positionColors: Record<string, string> = {
    Spiker: 'bg-red-50 text-red-700 border border-red-200',
    Setter: 'bg-blue-50 text-blue-700 border border-blue-200',
    Blocker: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Libero: 'bg-purple-50 text-purple-700 border border-purple-200',
    default: 'bg-slate-50 text-slate-700 border border-slate-200',
  }

  const bgColor = positionColors[position] || positionColors.default
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Card className="group p-6 transition hover:shadow-lg hover:-translate-y-1 border border-border bg-card">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-lg font-bold text-primary ring-2 ring-primary/20">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold truncate text-foreground">{name}</h3>
          <p className="text-muted-foreground text-sm font-semibold">#{jerseyNumber}</p>
          <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${bgColor}`}>
            {position}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-muted-foreground text-sm">
          <strong>Team:</strong> {team}
        </div>
        {height && (
          <div className="text-muted-foreground text-sm">
            <strong>Height:</strong> {height}
          </div>
        )}
        {weight && (
          <div className="text-muted-foreground text-sm">
            <strong>Weight:</strong> {weight}
          </div>
        )}
      </div>

      <button className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 shadow-sm">
        View Profile
      </button>
    </Card>
  )
}
