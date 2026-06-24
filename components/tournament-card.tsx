import { Card } from '@/components/ui/card'
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
}

export function TournamentCard({
  name,
  startDate,
  endDate,
  location,
  status,
  teamsCount,
  imageUrl,
}: TournamentCardProps) {
  const statusColors = {
    upcoming: 'bg-blue-50 text-blue-700 border border-blue-200',
    ongoing: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    completed: 'bg-slate-100 text-slate-600 border border-slate-200',
  }

  return (
    <Card className="group overflow-hidden p-0 transition hover:shadow-lg hover:-translate-y-1 flex flex-col border border-border bg-card">
      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary to-accent">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Trophy className="h-12 w-12 text-primary-foreground/70" />
          </div>
        )}
        <span
          className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-balance mb-4">{name}</h3>

        <div className="space-y-3 mb-5 flex-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} className="text-accent shrink-0" />
            <span className="text-sm">
              {startDate} to {endDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={16} className="text-accent shrink-0" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy size={16} className="text-accent shrink-0" />
            <span className="text-sm">{teamsCount} teams participating</span>
          </div>
        </div>

        <button className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 shadow-sm">
          View Details
        </button>
      </div>
    </Card>
  )
}
