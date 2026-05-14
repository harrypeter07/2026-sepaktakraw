import { Card } from '@/components/ui/card'
import { Users, MapPin } from 'lucide-react'

interface TeamCardProps {
  id: string
  name: string
  location: string
  coach: string
  playerCount: number
  established: string
}

export function TeamCard({
  name,
  location,
  coach,
  playerCount,
  established,
}: TeamCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-4">{name}</h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={16} />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={16} />
          <span className="text-sm">{playerCount} players</span>
        </div>
        <div className="text-muted-foreground text-sm">
          <strong>Coach:</strong> {coach}
        </div>
        <div className="text-muted-foreground text-sm">
          <strong>Est.:</strong> {established}
        </div>
      </div>

      <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-md font-medium transition text-sm">
        View Roster
      </button>
    </Card>
  )
}
