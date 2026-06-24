import { Card } from '@/components/ui/card'
import { Users, MapPin } from 'lucide-react'

interface TeamCardProps {
  id: string
  name: string
  location: string
  coach: string
  playerCount: number
  established: string
  logoUrl?: string
}

export function TeamCard({
  name,
  location,
  coach,
  playerCount,
  established,
  logoUrl,
}: TeamCardProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Card className="group overflow-hidden p-0 transition hover:shadow-lg hover:-translate-y-1 flex flex-col border border-border bg-card">
      {/* Header with logo */}
      <div className="flex items-center gap-4 bg-secondary/40 p-6 border-b border-border text-foreground">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-lg font-bold text-primary-foreground ring-2 ring-accent/20">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <h3 className="text-xl font-bold text-balance leading-tight text-primary">{name}</h3>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="space-y-3 mb-5 flex-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={16} className="text-accent shrink-0" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={16} className="text-accent shrink-0" />
            <span className="text-sm">{playerCount} players</span>
          </div>
          <div className="text-muted-foreground text-sm">
            <strong>Coach:</strong> {coach}
          </div>
          <div className="text-muted-foreground text-sm">
            <strong>Est.:</strong> {established}
          </div>
        </div>

        <button className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 shadow-sm">
          View Roster
        </button>
      </div>
    </Card>
  )
}
