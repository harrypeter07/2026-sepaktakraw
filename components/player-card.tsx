import { Card } from '@/components/ui/card'

interface PlayerCardProps {
  id: string
  name: string
  position: string
  team: string
  jerseyNumber: number
  height?: string
  weight?: string
}

export function PlayerCard({
  name,
  position,
  team,
  jerseyNumber,
  height,
  weight,
}: PlayerCardProps) {
  const positionColors: Record<string, string> = {
    'Spiker': 'bg-red-100 text-red-800',
    'Setter': 'bg-blue-100 text-blue-800',
    'Blocker': 'bg-green-100 text-green-800',
    'Libero': 'bg-purple-100 text-purple-800',
    default: 'bg-gray-100 text-gray-800',
  }

  const bgColor = positionColors[position] || positionColors.default

  return (
    <Card className="p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-muted-foreground text-sm">#{jerseyNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bgColor}`}>
          {position}
        </span>
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

      <button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-2 rounded-md font-medium transition text-sm">
        View Profile
      </button>
    </Card>
  )
}
