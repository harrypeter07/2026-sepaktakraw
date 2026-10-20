'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { TournamentCard } from '@/components/tournament-card'
import { PageHero } from '@/components/page-hero'
import { Tournament, Team } from '@/lib/data-manager'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Info,
  DollarSign,
  ShieldAlert,
  Medal,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import recordsData from '@/lib/msta-records.json'

const FORMAT_LABELS: Record<string, string> = {
  league: 'League',
  knockout: 'Knockout',
  group_stage: 'Group Stage',
}

const formatPrize = (amount?: number) =>
  amount != null ? `₹${amount.toLocaleString('en-IN')}` : null

interface TournamentsClientProps {
  initialTournaments: Tournament[]
  initialTeams: Team[]
}

export function TournamentsClient({
  initialTournaments,
  initialTeams,
}: TournamentsClientProps) {
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'upcoming' | 'ongoing' | 'completed'
  >('all')
  const [selectedTournament, setSelectedTournament] = useState<any | null>(null)

  // Podium records archive state
  const [podiumSearch, setPodiumSearch] = useState('')
  const [podiumYear, setPodiumYear] = useState('all')
  const [podiumCategory, setPodiumCategory] = useState('all')
  const [podiumPage, setPodiumPage] = useState(1)
  const podiumPageSize = 15

  const filteredTournaments =
    filterStatus === 'all'
      ? initialTournaments
      : initialTournaments.filter((t) => t.status === filterStatus)

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

  const getRegisteredTeams = (count: number) =>
    initialTeams.slice(0, Math.min(count, initialTeams.length)).map((t) => t.name)

  const allPodiumRecords = recordsData.podiumRecords || []

  const filteredPodiums = useMemo(() => {
    return allPodiumRecords.filter((rec) => {
      if (podiumYear !== 'all' && rec.year !== podiumYear) return false
      if (podiumCategory !== 'all' && rec.category !== podiumCategory) return false
      if (podiumSearch.trim()) {
        const query = podiumSearch.toLowerCase()
        const matchesDistrict = rec.district.toLowerCase().includes(query)
        const matchesEvent = rec.event.toLowerCase().includes(query)
        const matchesCat = rec.category.toLowerCase().includes(query)
        if (!matchesDistrict && !matchesEvent && !matchesCat) return false
      }
      return true
    })
  }, [allPodiumRecords, podiumYear, podiumCategory, podiumSearch])

  const totalPodiumPages = Math.ceil(filteredPodiums.length / podiumPageSize) || 1
  const paginatedPodiums = useMemo(() => {
    const start = (podiumPage - 1) * podiumPageSize
    return filteredPodiums.slice(start, start + podiumPageSize)
  }, [filteredPodiums, podiumPage])

  const handleYearChange = (year: string) => {
    setPodiumYear(year)
    setPodiumPage(1)
  }

  const handleCategoryChange = (cat: string) => {
    setPodiumCategory(cat)
    setPodiumPage(1)
  }

  const handleSearchChange = (val: string) => {
    setPodiumSearch(val)
    setPodiumPage(1)
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero */}
      <PageHero
        imageKey="tournaments.hero.image"
        kicker="Competitions"
        title="Tournaments"
        subtitle="Explore upcoming, ongoing, and state championship tournaments across Maharashtra"
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
              let activeStyle =
                'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10'
              if (tab.value === 'upcoming' && isSelected)
                activeStyle =
                  'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
              if (tab.value === 'ongoing' && isSelected)
                activeStyle =
                  'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100'
              if (tab.value === 'completed' && isSelected)
                activeStyle =
                  'bg-slate-600 text-white border-slate-600 shadow-md shadow-slate-100'

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

      {/* Tournaments Grid (Zero Loading Delay) */}
      <section className="py-16 sm:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  {...tournament}
                  onViewDetails={() => setSelectedTournament(tournament)}
                />
              ))}
            </div>
          ) : filterStatus === 'ongoing' ? (
            <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Trophy className="h-7 w-7" />
              </div>
              <h3 className="text-slate-900 text-xl font-black">
                No Tournaments In Progress Today
              </h3>
              <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                The <span className="font-bold text-slate-800">36th Senior Maharashtra State Sepaktakraw Championship 2026</span> has concluded. The next sanctioned state tournament begins soon.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setFilterStatus('upcoming')}
                  className="px-5 py-2.5 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold hover:bg-[#2563eb] transition shadow-sm cursor-pointer"
                >
                  View Upcoming Tournaments ({initialTournaments.filter(t => t.status === 'upcoming').length})
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
                >
                  View Completed Results ({initialTournaments.filter(t => t.status === 'completed').length})
                </button>
              </div>
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
              <button
                onClick={() => setFilterStatus('all')}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
              >
                Reset to All Tournaments
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── HISTORICAL STATE CHAMPIONSHIP ROLL OF HONOUR ─── */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-black uppercase tracking-wider mb-3">
              <Medal size={14} className="text-amber-400" />
              MSTA Historical Archive (2021 – 2026)
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              STATE CHAMPIONSHIP ROLL OF HONOUR
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Official podium finishes across Senior, Junior, and Sub-Junior State Championships verified by the Technical Commission.
            </p>
          </div>

          {/* Filter and Search Controls */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={podiumSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search district, event, category..."
                  className="w-full bg-slate-900/90 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>

              <div>
                <select
                  value={podiumYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full bg-slate-900/90 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Championship Seasons (2021-2026)</option>
                  <option value="2025-26">2025-26 Championship Season</option>
                  <option value="2024-25">2024-25 Championship Season</option>
                  <option value="2023-24">2023-24 Championship Season</option>
                  <option value="2022-23">2022-23 Championship Season</option>
                  <option value="2021-22">2021-22 Championship Season</option>
                </select>
              </div>

              <div>
                <select
                  value={podiumCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-900/90 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Event Categories</option>
                  <option value="Senior Men">Senior Men</option>
                  <option value="Senior Women">Senior Women</option>
                  <option value="Junior Boys">Junior Boys</option>
                  <option value="Junior Girls">Junior Girls</option>
                  <option value="Sub-Junior Boys">Sub-Junior Boys</option>
                  <option value="Sub-Junior Girls">Sub-Junior Girls</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
              <span>
                Showing <strong className="text-white font-bold">{paginatedPodiums.length}</strong> of{' '}
                <strong className="text-white font-bold">{filteredPodiums.length}</strong> official podium finishes
              </span>
              <span className="text-[11px] text-blue-400 font-semibold">
                Page {podiumPage} of {totalPodiumPages}
              </span>
            </div>
          </div>

          {/* Results Table */}
          {filteredPodiums.length === 0 ? (
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700 p-12 text-center">
              <Filter className="h-10 w-10 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-bold text-base">No championship podiums matched your criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the season or search keywords.</p>
            </div>
          ) : (
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-700">
                      <th className="py-3.5 px-4 sm:px-6">Season</th>
                      <th className="py-3.5 px-4 sm:px-6">Category</th>
                      <th className="py-3.5 px-4 sm:px-6">Event</th>
                      <th className="py-3.5 px-4 sm:px-6">Medal</th>
                      <th className="py-3.5 px-4 sm:px-6">Winning District</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">District Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {paginatedPodiums.map((item, idx) => {
                      const medalColor =
                        item.medal === 'Gold'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : item.medal === 'Silver'
                          ? 'bg-slate-300/20 text-slate-200 border-slate-400/40'
                          : 'bg-amber-700/20 text-amber-500 border-amber-600/40'

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-700/40 transition duration-150 group"
                        >
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-blue-400 whitespace-nowrap">
                            {item.year}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-300 whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 font-semibold text-white whitespace-nowrap">
                            {item.event}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-extrabold uppercase ${medalColor}`}
                            >
                              <Medal size={12} />
                              {item.medal}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 font-black text-slate-100 whitespace-nowrap">
                            {item.district}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                            <Link
                              href={`/districts/${encodeURIComponent(item.district.toLowerCase())}`}
                              className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 font-bold group-hover:translate-x-0.5 transition"
                            >
                              View District →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPodiumPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/90 border-t border-slate-700">
                  <button
                    onClick={() => setPodiumPage((p) => Math.max(1, p - 1))}
                    disabled={podiumPage === 1}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 transition"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  <span className="text-xs text-slate-400 font-semibold">
                    Page <strong className="text-white">{podiumPage}</strong> of{' '}
                    <strong className="text-white">{totalPodiumPages}</strong>
                  </span>

                  <button
                    onClick={() => setPodiumPage((p) => Math.min(totalPodiumPages, p + 1))}
                    disabled={podiumPage === totalPodiumPages}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 transition"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Tournament Details Dialog */}
      <Dialog
        open={selectedTournament !== null}
        onOpenChange={(open) => !open && setSelectedTournament(null)}
      >
        {selectedTournament && (
          <DialogContent className="max-w-2xl bg-white border rounded-2xl p-6 sm:p-8">
            <DialogHeader className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`font-bold px-3 py-0.5 rounded-full border text-xs uppercase ${getBadgeColor(
                    selectedTournament.status
                  )}`}
                >
                  {selectedTournament.status}
                </Badge>
                {selectedTournament.format && (
                  <Badge
                    variant="secondary"
                    className="font-semibold text-xs rounded-full"
                  >
                    {FORMAT_LABELS[selectedTournament.format] ||
                      selectedTournament.format}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                {selectedTournament.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar size={18} className="text-accent shrink-0" />
                  <div className="text-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Date Schedule
                    </p>
                    <p className="font-bold">
                      {selectedTournament.startDate} to{' '}
                      {selectedTournament.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <MapPin size={18} className="text-accent shrink-0" />
                  <div className="text-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Location / Venue
                    </p>
                    <p className="font-bold truncate">
                      {selectedTournament.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <DollarSign size={18} className="text-accent shrink-0" />
                  <div className="text-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Prize Pool
                    </p>
                    <p className="font-bold">
                      {formatPrize(selectedTournament.prizePool) || 'TBA'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Users size={18} className="text-accent shrink-0" />
                  <div className="text-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Registered Teams
                    </p>
                    <p className="font-bold">
                      {selectedTournament.teamsCount} Teams
                    </p>
                  </div>
                </div>
              </div>

              {selectedTournament.organizer && (
                <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <p>
                    Organized by{' '}
                    <strong className="text-slate-700 font-semibold">
                      {selectedTournament.organizer}
                    </strong>
                  </p>
                </div>
              )}

              {selectedTournament.description && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                    Tournament Overview
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedTournament.description}
                  </p>
                </div>
              )}

              {getRegisteredTeams(selectedTournament.teamsCount).length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
                    Featured Participating Teams
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getRegisteredTeams(selectedTournament.teamsCount).map(
                      (teamName, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-lg shadow-sm text-xs font-bold text-slate-700 hover:border-accent hover:text-accent transition duration-200"
                        >
                          <Trophy size={12} className="text-accent shrink-0" />
                          <span className="truncate">{teamName}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </main>
  )
}
