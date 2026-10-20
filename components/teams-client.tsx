'use client'

import { useState } from 'react'
import { TeamCard } from '@/components/team-card'
import { PageHero } from '@/components/page-hero'
import { StateSquadShowcase } from '@/components/state-squad-showcase'
import { Team, Player } from '@/lib/data-manager'
import { Search, Trophy, ShieldAlert } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface TeamsClientProps {
  initialTeams: Team[]
  initialPlayers: Player[]
}

export function TeamsClient({ initialTeams, initialPlayers }: TeamsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const filteredTeams = initialTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoster = (teamName: string): Player[] =>
    initialPlayers.filter((p) => p.team.toLowerCase() === teamName.toLowerCase())

  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'Tekong':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Killer':
      case 'Striker':
      case 'Spiker':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'Feeder':
      case 'Setter':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <>
      {/* Hero */}
      <PageHero
        imageKey="teams.hero.image"
        kicker="Competitive Clubs"
        title="Teams"
        subtitle="Meet the competitive teams across Maharashtra"
      />

      {/* Search Bar */}
      <section className="py-6 bg-card border-b border-border shadow-sm sticky top-16 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <Input
              type="text"
              placeholder="Search teams by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-6 rounded-xl border border-border bg-background focus-visible:ring-accent text-sm shadow-sm transition-all"
            />
          </div>
        </div>
      </section>

      {/* Teams Grid & State Squad */}
      <section className="py-12 sm:py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Official State Squad Showcase */}
          <StateSquadShowcase />

          <div className="mb-8 flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">
                Maharashtra District Teams & Clubs
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Competitive district units participating in official Maharashtra State Championships
              </p>
            </div>
          </div>

          {filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  {...team}
                  onViewRoster={() => setSelectedTeam(team)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border shadow-sm max-w-lg mx-auto">
              <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-bold">No teams found</p>
              <p className="text-muted-foreground text-sm mt-1">
                Try typing a different search query.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Team Roster Dialog */}
      <Dialog
        open={selectedTeam !== null}
        onOpenChange={(open) => !open && setSelectedTeam(null)}
      >
        {selectedTeam && (
          <DialogContent className="max-w-xl bg-white border rounded-2xl p-6 sm:p-8">
            <DialogHeader className="border-b pb-4 mb-4">
              <DialogTitle className="text-2xl font-extrabold text-primary flex items-center gap-2">
                <Trophy className="text-accent h-6 w-6 shrink-0" />
                {selectedTeam.name} — Players & Squad
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 font-medium mt-1">
                Head Coach: <strong className="text-slate-700">{selectedTeam.coach}</strong> |
                Established: <strong className="text-slate-700">{selectedTeam.established}</strong>
              </DialogDescription>
            </DialogHeader>

            {/* Players List */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Registered Athletes ({getRoster(selectedTeam.name).length})
              </h4>
              {getRoster(selectedTeam.name).length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No players have been added to this team yet.
                </p>
              )}
              <div className="space-y-2">
                {getRoster(selectedTeam.name).map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                        #{player.jerseyNumber}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{player.name}</p>
                        {player.height && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Height: {player.height}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-semibold px-2.5 py-0.5 rounded-full border text-[11px] ${getPositionBadge(
                        player.position
                      )}`}
                    >
                      {player.position}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
