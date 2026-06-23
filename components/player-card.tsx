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
    Spiker: 'bg-red-100 text-red-800',
    Setter: 'bg-blue-100 text-blue-800',
    Blocker: 'bg-green-100 text-green-800',
    Libero: 'bg-purple-100 text-purple-800',
    default: 'bg-gray-100 text-gray-800',
  }

  const bgColor = positionColors[position] || positionColors.default
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Card className="group p-6 transition hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-lg font-bold text-muted-foreground ring-2 ring-border">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold truncate">{name}</h3>
          <p className="text-muted-foreground text-sm">#{jerseyNumber}</p>
          <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${bgColor}`}>
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

      <button className="w-full rounded-md bg-accent py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent/90">
        View Profile
      </button>
    </Card>
  )
}
