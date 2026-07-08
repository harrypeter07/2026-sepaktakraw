'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { PlayerCard } from '@/components/player-card'
import { PageHero } from '@/components/page-hero'
import { PlayerManager, Player } from '@/lib/data-manager'
import { Filter, User, Calendar, Ruler, Scale, Trophy, Activity, RefreshCw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function PlayersPage() {
  const [filterPosition, setFilterPosition] = useState<string>('all')
  const [filterTeam, setFilterTeam] = useState<string>('all')
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const customPlayers = await PlayerManager.getAll()
        setPlayers(customPlayers)
      } catch (err) {
        console.error('Error loading players:', err)
        setPlayers([])
      } finally {
        setIsLoaded(true)
      }
    }
    loadPlayers()
  }, [])

  const positions = ['Spiker', 'Setter', 'Blocker', 'Libero']
  const teams = Array.from(new Set(players.map(p => p.team)))

  const filteredPlayers = players.filter(player => {
    const positionMatch = filterPosition === 'all' || player.position === filterPosition
    const teamMatch = filterTeam === 'all' || player.team === filterTeam
    return positionMatch && teamMatch
  })

  // Guide about player position responsibilities
  const getPositionDescription = (pos: string) => {
    switch (pos) {
      case 'Spiker':
        return 'Spikers (or Tekongs/Attackers) carry out lethal acrobatic kicks over the net, including roll spikes and sunback spikes, to score points.'
      case 'Setter':
        return 'Setters control the pace of the play. They have precise foot and head control to set up high-accuracy balls perfectly positioned for the spiker.'
      case 'Blocker':
        return 'Blockers occupy the net defense. They jump high to block roll spikes using their legs and back, requiring immense timing and strength.'
      case 'Libero':
        return 'Liberos are defense experts. They specialize in receiving high-velocity services and roll spikes, saving crucial points in the backcourt.'
      default:
        return 'A professional Sepaktakraw athlete representing Maharashtra.'
    }
  }

  // Helper for position color badge in modal
  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'Spiker':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Setter':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Blocker':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Libero':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const handleResetFilters = () => {
    setFilterPosition('all')
    setFilterTeam('all')
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-slate-50/50">
        {/* Hero */}
        <PageHero
          imageKey="players.hero.image"
          kicker="Elite Athletes"
          title="Players"
          subtitle="Discover elite Sepaktakraw athletes"
        />

        {/* Filters */}
        <section className="py-6 bg-card border-b border-border shadow-sm sticky top-16 z-40 backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 items-end justify-center max-w-4xl mx-auto">
              {/* Position Filter */}
              <div className="w-full space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Filter size={13} className="text-accent" /> Filter by Position
                </label>
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-slate-200 rounded-xl bg-background text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent transition cursor-pointer"
                >
                  <option value="all">All Positions</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              {/* Team Filter */}
              <div className="w-full space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Filter size={13} className="text-accent" /> Filter by Team
                </label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-slate-200 rounded-xl bg-background text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent transition cursor-pointer"
                >
                  <option value="all">All Teams</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              {/* Reset Action */}
              {(filterPosition !== 'all' || filterTeam !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="h-11 px-4 py-2 border border-dashed border-slate-300 rounded-xl bg-background hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 w-full sm:w-auto justify-center"
                >
                  <RefreshCw size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Players Grid */}
        <section className="py-16 sm:py-24 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!isLoaded ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground text-sm font-semibold">Loading athletes...</p>
              </div>
            ) : filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlayers.map(player => (
                  <PlayerCard 
                    key={player.id} 
                    {...player} 
                    onViewProfile={() => setSelectedPlayer(player)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border shadow-sm max-w-lg mx-auto">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg font-bold">
                  No athletes found
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Try adjusting or clearing your filters above.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Player Profile Details Dialog */}
        <Dialog open={selectedPlayer !== null} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
          {selectedPlayer && (
            <DialogContent className="max-w-md bg-white border rounded-2xl p-6 sm:p-8">
              <DialogHeader className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
                {/* Large Avatar */}
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary font-extrabold text-2xl ring-4 ring-primary/10 shadow-md mb-4">
                  {selectedPlayer.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedPlayer.photoUrl} alt={selectedPlayer.name} className="h-full w-full object-cover" />
                  ) : (
                    selectedPlayer.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()
                  )}
                </div>
                
                <Badge variant="outline" className={`font-bold px-3 py-0.5 rounded-full border text-xs uppercase mb-2 ${getPositionBadge(selectedPlayer.position)}`}>
                  {selectedPlayer.position}
                </Badge>
                
                <DialogTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  {selectedPlayer.name}
                </DialogTitle>
                <p className="text-xs font-bold text-accent uppercase tracking-wider mt-1">Jersey #{selectedPlayer.jerseyNumber}</p>
              </DialogHeader>

              {/* Profile Details Content */}
              <div className="space-y-5 mt-5">
                {/* Physical metrics band */}
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex flex-col items-center">
                    <Trophy size={14} className="text-accent mb-1" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Team</span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-full mt-0.5">{selectedPlayer.team}</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-slate-200">
                    <Ruler size={14} className="text-accent mb-1" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Height</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5">{selectedPlayer.height || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Scale size={14} className="text-accent mb-1" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Weight</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5">{selectedPlayer.weight || 'N/A'}</span>
                  </div>
                </div>

                {/* Role Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
                    <Activity size={13} className="text-accent" /> Play Style & Position Role
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-blue-50/30 p-3 rounded-lg border border-blue-50/80">
                    {getPositionDescription(selectedPlayer.position)}
                  </p>
                </div>

                {/* Bio Section */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Athlete Profile Summary</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    A key player for the {selectedPlayer.team} squad. Dedicated to advancing Maharashtra Sepaktakraw on the national stage, demonstrating exceptional athleticism, sportsmanship, and teamwork.
                  </p>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </main>
      <Footer />
    </>
  )
}
