'use client'

import { useState } from 'react'
import { PlayerCard } from '@/components/player-card'
import { PageHero } from '@/components/page-hero'
import { Player } from '@/lib/data-manager'
import registeredPlayersData from '@/lib/registered-players.json'
import { Filter, User, Ruler, Scale, Trophy, Activity, RefreshCw, Search, ShieldCheck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface PlayersClientProps {
  initialPlayers: Player[]
}

export function PlayersClient({ initialPlayers }: PlayersClientProps) {
  const [filterPosition, setFilterPosition] = useState<string>('all')
  const [filterTeam, setFilterTeam] = useState<string>('all')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  // State URN Registry view state
  const [activeView, setActiveView] = useState<'featured' | 'registry'>('featured')
  const [registrySearch, setRegistrySearch] = useState('')
  const [registryDivision, setRegistryDivision] = useState('all')
  const [registryDistrict, setRegistryDistrict] = useState('all')
  const [registryPage, setRegistryPage] = useState(1)
  const registryPageSize = 20

  const positions = [
    {
      id: 'Tekong',
      label: 'Tekong (Server / Back)',
      short: 'Tekong',
      count: initialPlayers.filter((p) => {
        const pos = (p.position || '').toLowerCase()
        return pos === 'tekong' || pos === 'server'
      }).length,
    },
    {
      id: 'Killer',
      label: 'Killer (Acrobatic Striker)',
      short: 'Killer',
      count: initialPlayers.filter((p) => {
        const pos = (p.position || '').toLowerCase()
        return pos === 'killer' || pos === 'striker' || pos === 'spiker'
      }).length,
    },
    {
      id: 'Feeder',
      label: 'Feeder (Setter / Playmaker)',
      short: 'Feeder',
      count: initialPlayers.filter((p) => {
        const pos = (p.position || '').toLowerCase()
        return pos === 'feeder' || pos === 'setter'
      }).length,
    },
  ]
  const teams = Array.from(new Set(initialPlayers.map((p) => p.team)))

  const filteredPlayers = initialPlayers.filter((player) => {
    const pPos = (player.position || '').toLowerCase()
    let positionMatch = filterPosition === 'all'
    if (!positionMatch) {
      if (filterPosition === 'Tekong') {
        positionMatch = pPos === 'tekong' || pPos === 'server'
      } else if (filterPosition === 'Killer') {
        positionMatch = pPos === 'killer' || pPos === 'striker' || pPos === 'spiker'
      } else if (filterPosition === 'Feeder') {
        positionMatch = pPos === 'feeder' || pPos === 'setter'
      } else {
        positionMatch = pPos === filterPosition.toLowerCase()
      }
    }
    const teamMatch = filterTeam === 'all' || player.team === filterTeam
    return positionMatch && teamMatch
  })

  const registryDistricts = [
    'all',
    ...Array.from(new Set(registeredPlayersData.map((p) => p.district).filter(Boolean))),
  ]
  const registryDivisions = [
    'all',
    ...Array.from(new Set(registeredPlayersData.map((p) => p.division).filter(Boolean))),
  ]

  const filteredRegistry = registeredPlayersData.filter((p: any) => {
    const searchLower = registrySearch.toLowerCase()
    const matchesSearch =
      p.name.toLowerCase().includes(searchLower) ||
      (p.urn && p.urn.toLowerCase().includes(searchLower)) ||
      (p.district && p.district.toLowerCase().includes(searchLower)) ||
      (p.position && p.position.toLowerCase().includes(searchLower))
    const matchesDiv = registryDivision === 'all' || p.division === registryDivision
    const matchesDist = registryDistrict === 'all' || p.district === registryDistrict
    return matchesSearch && matchesDiv && matchesDist
  })

  const totalRegistryPages = Math.ceil(filteredRegistry.length / registryPageSize) || 1
  const safeRegistryPage = Math.min(Math.max(1, registryPage), totalRegistryPages)
  const paginatedRegistry = filteredRegistry.slice(
    (safeRegistryPage - 1) * registryPageSize,
    safeRegistryPage * registryPageSize
  )

  const getPositionDescription = (pos: string) => {
    const p = (pos || '').toLowerCase()
    if (p.includes('tekong') || p.includes('server')) {
      return 'The Tekong is the server stationed inside the back service circle. They execute high-velocity, dipping service kicks directly over the net to score aces and initiate attacks.'
    }
    if (p.includes('killer') || p.includes('striker') || p.includes('spiker')) {
      return 'The Killer (Striker) is the primary attacker responsible for acrobatic spikes (roll spikes, sunback spikes) and aggressive net blocks at tremendous velocity.'
    }
    if (p.includes('feeder') || p.includes('setter')) {
      return 'The Feeder (Setter) controls the rally tempo by receiving opponent attacks and setting up precision high-loft passes for the Killer to execute devastating spikes.'
    }
    return 'An elite registered Sepaktakraw athlete representing Maharashtra in official state championships.'
  }

  const getPositionBadge = (pos: string) => {
    const p = (pos || '').toLowerCase()
    if (p.includes('tekong') || p.includes('server')) {
      return 'bg-amber-100 text-amber-900 border-amber-300'
    }
    if (p.includes('killer') || p.includes('striker') || p.includes('spiker')) {
      return 'bg-rose-100 text-rose-900 border-rose-300'
    }
    if (p.includes('feeder') || p.includes('setter')) {
      return 'bg-blue-100 text-blue-900 border-blue-300'
    }
    return 'bg-slate-100 text-slate-800 border-slate-200'
  }

  const handleResetFilters = () => {
    setFilterPosition('all')
    setFilterTeam('all')
  }

  return (
    <>
      {/* Hero */}
      <PageHero
        imageKey="players.hero.image"
        kicker="Elite Athletes"
        title="Players"
        subtitle="Discover elite Sepaktakraw athletes"
      />

      {/* View Switcher Bar */}
      <section className="bg-slate-100/80 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200/90 shadow-xs">
            <button
              onClick={() => setActiveView('featured')}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                activeView === 'featured'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Featured Athletes ({initialPlayers.length})
            </button>
            <button
              onClick={() => setActiveView('registry')}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'registry'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck
                size={14}
                className={activeView === 'registry' ? 'text-amber-300' : 'text-blue-600'}
              />
              State URN Registry ({registeredPlayersData.length})
            </button>
          </div>
        </div>
      </section>

      {activeView === 'featured' ? (
        <>
          {/* Featured Athletes Filters */}
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
                    <option value="all">All Tactical Positions ({initialPlayers.length})</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.label} ({pos.count})
                      </option>
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
                    {teams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
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
              {filteredPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPlayers.map((player) => (
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
                  <p className="text-muted-foreground text-lg font-bold">No athletes found</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Try adjusting or clearing your filters above.
                  </p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        /* Official State URN Registry View */
        <section className="py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Registry Search & Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search player name, URN ID, or district..."
                    value={registrySearch}
                    onChange={(e) => {
                      setRegistrySearch(e.target.value)
                      setRegistryPage(1)
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto items-center">
                  {/* Division Filter */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <span>Division:</span>
                    <select
                      value={registryDivision}
                      onChange={(e) => {
                        setRegistryDivision(e.target.value)
                        setRegistryPage(1)
                      }}
                      className="h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {registryDivisions.map((div) => (
                        <option key={div} value={div}>
                          {div === 'all' ? 'All Divisions' : div}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Filter */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <span>District:</span>
                    <select
                      value={registryDistrict}
                      onChange={(e) => {
                        setRegistryDistrict(e.target.value)
                        setRegistryPage(1)
                      }}
                      className="h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {registryDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist === 'all' ? 'All Districts' : dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(registrySearch ||
                    registryDivision !== 'all' ||
                    registryDistrict !== 'all') && (
                    <button
                      onClick={() => {
                        setRegistrySearch('')
                        setRegistryDivision('all')
                        setRegistryDistrict('all')
                        setRegistryPage(1)
                      }}
                      className="h-9 px-3 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Registry Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                    <ShieldCheck className="text-blue-600 h-5 w-5" />
                    Official MSTA / NDSTA Registered Athletes
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Showing {filteredRegistry.length} verified athletes registered with official
                    sports identification numbers
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-bold self-start sm:self-auto">
                  Verified Roster
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Player Full Name</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Division</th>
                      <th className="py-3 px-4">Gender</th>
                      <th className="py-3 px-4">Jersey</th>
                      <th className="py-3 px-4 text-right">URN Registration ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    {paginatedRegistry.length > 0 ? (
                      paginatedRegistry.map((player, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition">
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {(safeRegistryPage - 1) * registryPageSize + idx + 1}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-slate-800">
                            {player.name}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold px-2 py-0.5 border ${getPositionBadge(
                                (player as any).position || 'Tekong'
                              )}`}
                            >
                              {(player as any).position || 'Tekong'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {player.district || 'Maharashtra'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold px-2 py-0.5 border-slate-200"
                            >
                              {player.division}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{player.gender || 'N/A'}</td>
                          <td className="py-3 px-4 font-bold text-slate-700">
                            {player.jerseyNumber ? `#${player.jerseyNumber}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-blue-600 text-[11px]">
                            {player.urn}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-slate-400 font-bold">
                          No athletes match the current search or filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
                <span className="text-slate-500">
                  Showing{' '}
                  {filteredRegistry.length === 0
                    ? 0
                    : (safeRegistryPage - 1) * registryPageSize + 1}{' '}
                  to {Math.min(safeRegistryPage * registryPageSize, filteredRegistry.length)} of{' '}
                  {filteredRegistry.length} athletes
                </span>

                {totalRegistryPages > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                      onClick={() => setRegistryPage((p) => Math.max(1, p - 1))}
                      disabled={safeRegistryPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold cursor-pointer"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalRegistryPages }).map((_, i) => {
                        const pageNum = i + 1
                        if (
                          pageNum === 1 ||
                          pageNum === totalRegistryPages ||
                          (pageNum >= safeRegistryPage - 1 && pageNum <= safeRegistryPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setRegistryPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-black transition cursor-pointer ${
                                safeRegistryPage === pageNum
                                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        }
                        if (
                          (pageNum === 2 && safeRegistryPage > 3) ||
                          (pageNum === totalRegistryPages - 1 &&
                            safeRegistryPage < totalRegistryPages - 2)
                        ) {
                          return (
                            <span key={pageNum} className="px-1 text-slate-400">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>

                    <button
                      onClick={() => setRegistryPage((p) => Math.min(totalRegistryPages, p + 1))}
                      disabled={safeRegistryPage === totalRegistryPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Player Profile Details Dialog */}
      <Dialog
        open={selectedPlayer !== null}
        onOpenChange={(open) => !open && setSelectedPlayer(null)}
      >
        {selectedPlayer && (
          <DialogContent className="max-w-md bg-white border rounded-2xl p-6 sm:p-8">
            <DialogHeader className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
              {/* Athletic Jersey Monogram Badge */}
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white font-black text-2xl shadow-lg ring-4 ring-blue-600/20 mb-4">
                {selectedPlayer.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>

              <Badge
                variant="outline"
                className={`font-bold px-3 py-0.5 rounded-full border text-xs uppercase mb-2 ${getPositionBadge(
                  selectedPlayer.position
                )}`}
              >
                {selectedPlayer.position}
              </Badge>

              <DialogTitle className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {selectedPlayer.name}
              </DialogTitle>
              <p className="text-xs font-bold text-accent uppercase tracking-wider mt-1">
                Jersey #{selectedPlayer.jerseyNumber}
              </p>
            </DialogHeader>

            {/* Profile Details Content */}
            <div className="space-y-5 mt-5">
              {/* Physical metrics band */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex flex-col items-center">
                  <Trophy size={14} className="text-accent mb-1" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Team
                  </span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-full mt-0.5">
                    {selectedPlayer.team}
                  </span>
                </div>
                <div className="flex flex-col items-center border-x border-slate-200">
                  <Ruler size={14} className="text-accent mb-1" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Height
                  </span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5">
                    {selectedPlayer.height || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Scale size={14} className="text-accent mb-1" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Weight
                  </span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5">
                    {selectedPlayer.weight || 'N/A'}
                  </span>
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Athlete Profile Summary
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A key player for the {selectedPlayer.team} squad. Dedicated to advancing
                  Maharashtra Sepaktakraw on the national stage, demonstrating exceptional
                  athleticism, sportsmanship, and teamwork.
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
