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
}

export function TournamentCard({
  name,
  startDate,
  endDate,
  location,
  status,
  teamsCount,
}: TournamentCardProps) {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  }

  return (
    <Card className="p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-balance">{name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={16} />
          <span className="text-sm">
            {startDate} to {endDate}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={16} />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Trophy size={16} />
          <span className="text-sm">{teamsCount} teams participating</span>
        </div>
      </div>

      <button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-2 rounded-md font-medium transition text-sm">
        View Details
      </button>
    </Card>
  )
}
