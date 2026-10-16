'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import districtsData from '@/lib/districts.json'
import recordsData from '@/lib/msta-records.json'
import registeredPlayersData from '@/lib/registered-players.json'
import { 
  TeamManager, PlayerManager, TournamentManager, MatchManager, Team, Player, Tournament 
} from '@/lib/data-manager'
import { 
  Mail, MapPin, Award, Building, Users, Calendar, Trophy, User, ArrowLeft, Users2, Shield, Medal, CheckCircle2 
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getCdnUrl } from '@/lib/cdn-image'

interface District {
  id: string
  name: string
  district: string
  logo: string
  status: string
  region: string
  email: string
  president: string
  secretary: string
  treasurer: string
}

export default function DistrictDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [district, setDistrict] = useState<District | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [tally, setTally] = useState<any>(null)
  const [podiums, setPodiums] = useState<any[]>([])
  const [registeredAthletes, setRegisteredAthletes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Find district details
    const foundDistrict = districtsData.find(d => d.id === id) as District | undefined
    if (!foundDistrict) {
      setIsLoading(false)
      return
    }
    setDistrict(foundDistrict)

    const loadData = async () => {
      try {
        const [allTeams, allPlayers, allTournaments, allMatches] = await Promise.all([
          TeamManager.getAll(),
          PlayerManager.getAll(),
          TournamentManager.getAll(),
          MatchManager.getAll(),
        ])

        const districtNameLower = foundDistrict.district.toLowerCase()
        const districtIdLower = foundDistrict.id.toLowerCase()

        // Match medal tally from MSTA records
        const distTally = recordsData.tallies.find(t => {
          const tNorm = t.district.toLowerCase()
          return (
            tNorm === districtNameLower ||
            districtNameLower.includes(tNorm) ||
            tNorm.includes(districtNameLower) ||
            (districtIdLower === 'aurangabad' && tNorm.includes('sambhaji'))
          )
        })
        setTally(distTally || null)

        // Match podium finishes from MSTA records (2021-2026)
        const distPodiums = recordsData.podiumRecords.filter(p => {
          const pNorm = p.district.toLowerCase()
          return (
            pNorm === districtNameLower ||
            districtNameLower.includes(pNorm) ||
            pNorm.includes(districtNameLower) ||
            (districtIdLower === 'aurangabad' && pNorm.includes('sambhaji'))
          )
        })
        setPodiums(distPodiums)

        // Match registered athletes from sanitized state URN roster
        const distRegistered = registeredPlayersData.filter((p: any) => {
          const dNorm = (p.district || '').toLowerCase()
          return (
            dNorm === districtNameLower ||
            districtNameLower.includes(dNorm) ||
            dNorm.includes(districtNameLower) ||
            (districtIdLower === 'aurangabad' && dNorm.includes('sambhaji'))
          )
        })
        setRegisteredAthletes(distRegistered)

        // Filter teams located in this district or mapped by districtId
        const districtTeams = allTeams.filter(t => {
          if (t.districtId && t.districtId.toLowerCase() === districtIdLower) return true
          const loc = t.location.toLowerCase()
          const name = t.name.toLowerCase()
          return loc.includes(districtNameLower) || name.includes(districtNameLower)
        })
        setTeams(districtTeams)

        // Filter players in these teams
        const teamNames = districtTeams.map(t => t.name.toLowerCase())
        const districtPlayers = allPlayers.filter(p => 
          teamNames.includes(p.team.toLowerCase())
        )
        setPlayers(districtPlayers)

        // Filter tournaments in this district
        const districtTournaments = allTournaments.filter(t => 
          t.location.toLowerCase().includes(districtNameLower) ||
          (t.organizer && t.organizer.toLowerCase().includes(districtNameLower))
        )
        setTournaments(districtTournaments)

        // Matches involving district tournaments or district teams
        const districtTournamentIds = districtTournaments.map(t => t.id)
        const districtTeamIds = districtTeams.map(t => t.id)
        const relevantMatches = allMatches.filter(m => 
          districtTournamentIds.includes(m.tournament_id) ||
          districtTeamIds.includes(m.home_team_id) ||
          districtTeamIds.includes(m.away_team_id)
        )

        // Map team names back to the matches
        const enrichedMatches = relevantMatches.map((m: any) => {
          const homeTeam = allTeams.find(t => t.id === m.home_team_id)
          const awayTeam = allTeams.find(t => t.id === m.away_team_id)
          const tournamentObj = allTournaments.find(t => t.id === m.tournament_id)
          return {
            ...m,
            homeTeamName: m.home_team_name || homeTeam?.name || 'Home Team',
            awayTeamName: m.away_team_name || awayTeam?.name || 'Away Team',
            homeLogoUrl: m.home_logo_url || homeTeam?.logoUrl || '',
            awayLogoUrl: m.away_logo_url || awayTeam?.logoUrl || '',
            tournamentName: m.tournament_name || tournamentObj?.name || 'Tournament'
          }
        })
        setMatches(enrichedMatches)
      } catch (err) {
        console.error('Error fetching district detail page data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">Loading district information...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!district) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center max-w-md px-6">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-black uppercase text-foreground">District Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The district association you are looking for does not exist or has been removed.
            </p>
            <button 
              onClick={() => router.push('/districts')}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black text-primary-foreground hover:bg-accent transition-all"
            >
              <ArrowLeft size={16} /> Back to Directory
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pb-16">
        {/* Header Hero Area */}
        <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <button 
              onClick={() => router.push('/districts')}
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm font-bold mb-6 transition"
            >
              <ArrowLeft size={16} /> Back to Directory
            </button>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* District Logo */}
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white flex items-center justify-center p-3 overflow-hidden shadow-2xl border border-white/10 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCdnUrl(district.logo)}
                  alt={district.name}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Title Copy */}
              <div className="text-center md:text-left space-y-3">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent border-none text-[10px] font-extrabold uppercase tracking-wider px-3 py-1">
                    {district.region} Region
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 border text-[10px] font-bold px-3 py-1">
                    {district.status} Unit
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight max-w-4xl text-white">
                  {district.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-primary-foreground/80 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-accent" />
                    {district.district}, Maharashtra
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail size={16} className="text-accent" />
                    <a href={`mailto:${district.email}`} className="hover:underline">{district.email}</a>
                  </span>
                </div>

                {/* Real MSTA Medal Count */}
                {tally && tally.total > 0 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                    {tally.gold > 0 && (
                      <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-lg text-xs font-black shadow-xs">
                        🥇 {tally.gold} Gold
                      </span>
                    )}
                    {tally.silver > 0 && (
                      <span className="bg-slate-200/20 text-slate-200 border border-slate-300/40 px-2.5 py-1 rounded-lg text-xs font-black shadow-xs">
                        🥈 {tally.silver} Silver
                      </span>
                    )}
                    {tally.bronze > 0 && (
                      <span className="bg-amber-700/30 text-amber-200 border border-amber-600/40 px-2.5 py-1 rounded-lg text-xs font-black shadow-xs">
                        🥉 {tally.bronze} Bronze
                      </span>
                    )}
                    <span className="text-xs text-primary-foreground/70 font-bold ml-1">
                      ({tally.total} State Championship Podiums)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* main grid content */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Sidebar Info Card */}
            <div className="space-y-6 lg:col-span-1">
              {/* Officials Box */}
              <div className="bg-secondary p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="text-lg font-black uppercase text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2">
                  <Users size={18} className="text-accent" />
                  Committee Officials
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground block">President</span>
                    <p className="font-extrabold text-foreground text-sm mt-0.5">{district.president}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground block">Secretary</span>
                    <p className="font-extrabold text-foreground text-sm mt-0.5">{district.secretary}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground block">Treasurer</span>
                    <p className="font-extrabold text-foreground text-sm mt-0.5">{district.treasurer}</p>
                  </div>
                </div>
              </div>

              {/* Affiliation Details */}
              <div className="bg-secondary p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="text-lg font-black uppercase text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2">
                  <Award size={18} className="text-accent" />
                  MSTA Affiliation
                </h3>
                <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    The <strong>{district.name}</strong> is a registered and affiliated district unit of the <strong>Maharashtra Sepaktakraw Association (MSTA)</strong>.
                  </p>
                  <p>
                    As an active member unit, this association is responsible for organizing district-level trials, registering local clubs/players, and coordinating representation in Maharashtra State Championships.
                  </p>
                </div>
              </div>
            </div>

            {/* Right main dynamic content blocks */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* State Championship Honors (2021-2026) */}
              <div className="bg-secondary p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
                  <div>
                    <h2 className="text-xl font-black uppercase text-foreground flex items-center gap-2">
                      <Trophy size={20} className="text-amber-500" />
                      State Championship Honors (2021–2026)
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Podium finishes won by {district.name} in Maharashtra State Championships
                    </p>
                  </div>
                  {tally && (
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                        🥇 {tally.gold}
                      </span>
                      <span className="text-xs font-black bg-slate-100 text-slate-900 border border-slate-300 px-2 py-0.5 rounded">
                        🥈 {tally.silver}
                      </span>
                      <span className="text-xs font-black bg-amber-50 text-amber-950 border border-amber-200 px-2 py-0.5 rounded">
                        🥉 {tally.bronze}
                      </span>
                    </div>
                  )}
                </div>

                {podiums.length > 0 ? (
                  <div className="overflow-x-auto max-h-80 overflow-y-auto pr-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground font-black uppercase text-[10px] tracking-wider">
                          <th className="py-2.5 px-3">Season</th>
                          <th className="py-2.5 px-3">Event</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3 text-right">Podium Finish</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {podiums.map((podium, pIdx) => {
                          const medalBadge = 
                            podium.medal === 'Gold' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            podium.medal === 'Silver' ? 'bg-slate-100 text-slate-900 border-slate-300' :
                            'bg-amber-50 text-amber-900 border-amber-200'

                          return (
                            <tr key={pIdx} className="hover:bg-background/40 transition">
                              <td className="py-2.5 px-3 font-bold text-foreground">
                                {podium.year}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-foreground">
                                {podium.event}
                              </td>
                              <td className="py-2.5 px-3 text-muted-foreground font-medium">
                                {podium.category}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${medalBadge}`}>
                                  {podium.medal === 'Gold' ? '🥇' : podium.medal === 'Silver' ? '🥈' : '🥉'} {podium.medal} ({podium.rank})
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-background/50 rounded-xl border border-dashed border-border px-4">
                    <Medal className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-muted-foreground">
                      No state championship podiums recorded for this district in 2021–2026.
                    </p>
                  </div>
                )}
              </div>

              {/* State Registered Athletes Directory (URN) */}
              {registeredAthletes.length > 0 && (
                <div className="bg-secondary p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                    <div>
                      <h2 className="text-xl font-black uppercase text-foreground flex items-center gap-2">
                        <Users2 size={20} className="text-accent" />
                        State Registered Athletes ({registeredAthletes.length})
                      </h2>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        Athletes holding official MSTA / NDSTA Unique Registration Numbers (URN)
                      </p>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                      Verified Roster
                    </Badge>
                  </div>

                  <div className="overflow-x-auto max-h-72 overflow-y-auto pr-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground font-black uppercase text-[10px] tracking-wider">
                          <th className="py-2.5 px-3">Player Name</th>
                          <th className="py-2.5 px-3">Division</th>
                          <th className="py-2.5 px-3">Gender</th>
                          <th className="py-2.5 px-3">Jersey #</th>
                          <th className="py-2.5 px-3 text-right">URN ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {registeredAthletes.map((ath, aIdx) => (
                          <tr key={aIdx} className="hover:bg-background/40 transition">
                            <td className="py-2.5 px-3 font-extrabold text-foreground">
                              {ath.name}
                            </td>
                            <td className="py-2.5 px-3">
                              <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5">
                                {ath.division}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground font-medium">
                              {ath.gender || 'N/A'}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-foreground">
                              {ath.jerseyNumber ? `#${ath.jerseyNumber}` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600 text-[11px]">
                              {ath.urn}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* District Teams Section */}
              <div className="bg-secondary p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-xl font-black uppercase text-foreground mb-6 flex items-center gap-2">
                  <Building size={20} className="text-accent" />
                  District Teams ({teams.length})
                </h2>

                {teams.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teams.map(t => (
                      <div key={t.id} className="p-4 bg-background border border-border rounded-xl flex items-center gap-4 hover:shadow-sm transition">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center p-1.5 overflow-hidden shrink-0 border border-border">
                          {t.logoUrl ? (
                            <img src={getCdnUrl(t.logoUrl)} alt={t.name} className="h-full w-full object-contain" />
                          ) : (
                            <Building className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm line-clamp-1">{t.name}</h4>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase block mt-0.5">Est. {t.established || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-background/50 rounded-xl border border-dashed border-border px-4">
                    <Building className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-muted-foreground">No clubs or teams registered in this district.</p>
                  </div>
                )}
              </div>

              {/* District Players List */}
              <div className="bg-secondary p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-xl font-black uppercase text-foreground mb-6 flex items-center gap-2">
                  <Users2 size={20} className="text-accent" />
                  Registered Players ({players.length})
                </h2>

                {players.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground font-black uppercase">
                          <th className="py-3 px-2">Name</th>
                          <th className="py-3 px-2">Position</th>
                          <th className="py-3 px-2">Registered Team</th>
                          <th className="py-3 px-2 text-right">Jersey</th>
                        </tr>
                      </thead>
                      <tbody>
                        {players.map(p => (
                          <tr key={p.id} className="border-b border-border/60 hover:bg-background/40 transition">
                            <td className="py-3 px-2 font-extrabold text-foreground">{p.name}</td>
                            <td className="py-3 px-2">
                              <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5">
                                {p.position}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 font-medium text-muted-foreground">{p.team}</td>
                            <td className="py-3 px-2 text-right font-bold text-foreground">#{p.jerseyNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-background/50 rounded-xl border border-dashed border-border px-4">
                    <Users2 className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-muted-foreground">No player registrations recorded for this district.</p>
                  </div>
                )}
              </div>

              {/* Matches & Tournaments */}
              <div className="bg-secondary p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-xl font-black uppercase text-foreground mb-6 flex items-center gap-2">
                  <Trophy size={20} className="text-accent" />
                  Tournaments & Match Events
                </h2>

                <div className="space-y-6">
                  {/* Tournaments Grid */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">District Venues</h3>
                    {tournaments.length > 0 ? (
                      <div className="space-y-3">
                        {tournaments.map(t => (
                          <div key={t.id} className="p-4 bg-background border border-border rounded-xl flex items-center justify-between hover:shadow-sm transition">
                            <div>
                              <h4 className="font-extrabold text-foreground text-sm">{t.name}</h4>
                              <span className="text-[10px] text-muted-foreground font-semibold block mt-0.5 flex items-center gap-1">
                                <Calendar size={12} className="text-accent" />
                                {t.startDate} to {t.endDate}
                              </span>
                            </div>
                            <Badge className="bg-accent text-accent-foreground uppercase font-bold text-[9px] px-2.5 py-0.5">
                              {t.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-background/50 rounded-xl border border-dashed border-border px-4 mb-4">
                        <Trophy className="h-6 w-6 text-muted-foreground/60 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-muted-foreground">No tournaments scheduled in this location.</p>
                      </div>
                    )}
                  </div>

                  {/* Matches List */}
                  {matches.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">District Match Scores</h3>
                      <div className="space-y-3">
                        {matches.map(m => (
                          <div key={m.id} className="p-4 bg-background border border-border rounded-xl text-center space-y-2">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">{m.tournamentName}</span>
                            <div className="flex items-center justify-center gap-6">
                              <div className="text-right flex-1">
                                <span className="font-extrabold text-foreground text-xs md:text-sm block">{m.homeTeamName}</span>
                              </div>
                              <div className="bg-secondary px-3 py-1 rounded-md border border-border flex items-center gap-2">
                                <span className="font-black text-foreground text-sm md:text-base">{m.home_score}</span>
                                <span className="text-muted-foreground font-bold text-xs">-</span>
                                <span className="font-black text-foreground text-sm md:text-base">{m.away_score}</span>
                              </div>
                              <div className="text-left flex-1">
                                <span className="font-extrabold text-foreground text-xs md:text-sm block">{m.awayTeamName}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-1">
                              <Badge variant="outline" className="text-[9px] font-semibold tracking-wider uppercase">
                                {m.status}
                              </Badge>
                              {m.venue && <span>• {m.venue}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
