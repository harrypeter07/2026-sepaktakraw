'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { TournamentCard } from '@/components/tournament-card'
import { PageHero } from '@/components/page-hero'
import { TournamentManager, TeamManager, Team } from '@/lib/data-manager'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Trophy, Users, Info, DollarSign, ShieldAlert } from 'lucide-react'

const FORMAT_LABELS: Record<string, string> = {
  league: 'League',
  knockout: 'Knockout',
  group_stage: 'Group Stage',
}

// Format a numeric prize pool as Indian rupees (e.g. 500000 → ₹5,00,000).
const formatPrize = (amount?: number) =>
  amount != null ? `₹${amount.toLocaleString('en-IN')}` : null

export default function TournamentsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all')
  const [tournaments, setTournaments] = useState<any[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<any | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customTournaments, allTeams] = await Promise.all([
          TournamentManager.getAll(),
          TeamManager.getAll()
        ])
        
        setTeams(allTeams)
        setTournaments(customTournaments)
      } catch (err) {
        console.error('Error loading tournaments:', err)
        setTournaments([])
      } finally {
        setIsLoaded(true)
      }
    }
    loadData()
  }, [])

  const filteredTournaments = filterStatus === 'all'
    ? tournaments
    : tournaments.filter(t => t.status === filterStatus)

  // Status Colors for Badge
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ongoing':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'completed':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  // Names of registered teams (drawn from the live teams list) for the modal.
  const getRegisteredTeams = (count: number) =>
    teams.slice(0, Math.min(count, teams.length)).map(t => t.name)

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-slate-50/50">
        {/* Hero */}
        <PageHero
          imageKey="tournaments.hero.image"
          kicker="Competitions"
          title="Tournaments"
          subtitle="Explore upcoming, ongoing, and completed tournaments"
        />

        {/* Filter Bar */}
        <section className="py-6 bg-card border-b border-border shadow-sm sticky top-16 z-40 backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
              {[
                { value: 'all', label: 'All Tournaments' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'ongoing', label: 'Ongoing' },
                { value: 'completed', label: 'Completed' },
              ].map((tab) => {
                const isSelected = filterStatus === tab.value
                let activeStyle = 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10'
                if (tab.value === 'upcoming' && isSelected) activeStyle = 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                if (tab.value === 'ongoing' && isSelected) activeStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100'
                if (tab.value === 'completed' && isSelected) activeStyle = 'bg-slate-600 text-white border-slate-600 shadow-md shadow-slate-100'

                return (
                  <button
                    key={tab.value}
                    onClick={() => setFilterStatus(tab.value as any)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                      isSelected
                        ? activeStyle
                        : 'bg-background text-muted-foreground border-border hover:bg-slate-100 hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Tournaments Grid */}
        <section className="py-16 sm:py-24 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!isLoaded ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground text-sm font-semibold">Loading tournaments...</p>
              </div>
            ) : filteredTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTournaments.map(tournament => (
                  <TournamentCard 
                    key={tournament.id} 
                    {...tournament} 
                    onViewDetails={() => setSelectedTournament(tournament)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border shadow-sm max-w-lg mx-auto">
                <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg font-bold">
                  No tournaments found
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Try selecting a different status filter above.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Tournament Details Dialog */}
        <Dialog open={selectedTournament !== null} onOpenChange={(open) => !open && setSelectedTournament(null)}>
          {selectedTournament && (
            <DialogContent className="max-w-2xl bg-white border rounded-2xl p-6 sm:p-8">
              <DialogHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={`font-bold px-3 py-0.5 rounded-full border text-xs uppercase ${getBadgeColor(selectedTournament.status)}`}>
                    {selectedTournament.status}
                  </Badge>
                  {selectedTournament.format && (
                    <Badge variant="secondary" className="font-semibold text-xs rounded-full">
                      {FORMAT_LABELS[selectedTournament.format] || selectedTournament.format}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  {selectedTournament.name}
                </DialogTitle>
              </DialogHeader>

              {/* Tournament Details Content */}
              <div className="space-y-6 mt-6">
                {/* Meta details list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Calendar size={18} className="text-accent shrink-0" />
                    <div className="text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Schedule</p>
                      <p className="font-bold">{selectedTournament.startDate} to {selectedTournament.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <MapPin size={18} className="text-accent shrink-0" />
                    <div className="text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location / Venue</p>
                      <p className="font-bold truncate">{selectedTournament.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <DollarSign size={18} className="text-accent shrink-0" />
                    <div className="text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prize Pool</p>
                      <p className="font-bold">{formatPrize(selectedTournament.prizePool) || 'TBA'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Users size={18} className="text-accent shrink-0" />
                    <div className="text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registered Teams</p>
                      <p className="font-bold">{selectedTournament.teamsCount} Teams</p>
                    </div>
                  </div>
                </div>

                {/* Organizer Info */}
                {selectedTournament.organizer && (
                  <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <p>Organized by <strong className="text-slate-700 font-semibold">{selectedTournament.organizer}</strong></p>
                  </div>
                )}

                {/* Description */}
                {selectedTournament.description && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">Tournament Overview</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedTournament.description}
                    </p>
                  </div>
                )}

                {/* Registered Teams Grid */}
                {getRegisteredTeams(selectedTournament.teamsCount).length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">Featured Participating Teams</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getRegisteredTeams(selectedTournament.teamsCount).map((teamName, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-lg shadow-sm text-xs font-bold text-slate-700 hover:border-accent hover:text-accent transition duration-200">
                          <Trophy size={12} className="text-accent shrink-0" />
                          <span className="truncate">{teamName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
      </main>
      <Footer />
    </>
  )
}
