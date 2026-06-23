'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { TournamentCard } from '@/components/tournament-card'
import { TeamCard } from '@/components/team-card'
import { PlayerCard } from '@/components/player-card'
import { TournamentForm, TournamentFormData } from '@/components/tournament-form'
import { TeamForm, TeamFormData } from '@/components/team-form'
import { PlayerForm, PlayerFormData } from '@/components/player-form'
import { LoginCard } from '@/components/login-card'
import { SiteSettingsManager } from '@/components/site-settings-manager'
import { TournamentManager, TeamManager, PlayerManager, Tournament, Team, Player } from '@/lib/data-manager'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { FEATURE_FLAGS } from '@/lib/feature-flags'

type AdminTab = 'tournaments' | 'teams' | 'players' | 'site'

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('tournaments')
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Form state
  const [showTournamentForm, setShowTournamentForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showPlayerForm, setShowPlayerForm] = useState(false)
  const [editingTournament, setEditingTournament] = useState<Tournament | undefined>()
  const [editingTeam, setEditingTeam] = useState<Team | undefined>()
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>()

  // 1. Tab Selection from Search Params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      if (
        tabParam === 'teams' ||
        tabParam === 'players' ||
        tabParam === 'tournaments' ||
        tabParam === 'site'
      ) {
        setActiveTab(tabParam)
      }
    }
  }, [])

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tournamentsData, teamsData, playersData] = await Promise.all([
          TournamentManager.getAll(),
          TeamManager.getAll(),
          PlayerManager.getAll()
        ])
        setTournaments(tournamentsData)
        setTeams(teamsData)
        setPlayers(playersData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    if (!FEATURE_FLAGS.USE_SUPABASE) {
      loadData()
    } else if (user && user.role === 'admin') {
      loadData()
    } else if (!isLoading) {
      setIsLoaded(true)
    }
  }, [user, isLoading])

  // Tournament handlers
  const handleAddTournament = async (data: TournamentFormData) => {
    try {
      const newTournament = await TournamentManager.add({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        status: data.status as any,
        teamsCount: parseInt(data.teamsCount),
        imageUrl: data.imageUrl,
      })
      setTournaments([...tournaments, newTournament])
    } catch (err) {
      alert('Failed to add tournament')
    }
  }

  const handleTournamentSubmit = async (data: TournamentFormData) => {
    if (editingTournament) {
      try {
        await TournamentManager.update(editingTournament.id, {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          status: data.status as any,
          teamsCount: parseInt(data.teamsCount),
          imageUrl: data.imageUrl,
        })
        setTournaments(tournaments.map(t => t.id === editingTournament.id ? {
          ...t,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          status: data.status as any,
          teamsCount: parseInt(data.teamsCount),
          imageUrl: data.imageUrl,
        } : t))
      } catch (err) {
        alert('Failed to update tournament')
      }
    } else {
      await handleAddTournament(data)
    }
    setShowTournamentForm(false)
    setEditingTournament(undefined)
  }

  const handleDeleteTournament = async (id: string) => {
    if (confirm('Are you sure you want to delete this tournament?')) {
      try {
        await TournamentManager.delete(id)
        setTournaments(tournaments.filter(t => t.id !== id))
      } catch (err) {
        alert('Failed to delete tournament')
      }
    }
  }

  // Team handlers
  const handleAddTeam = async (data: TeamFormData) => {
    try {
      const newTeam = await TeamManager.add({
        name: data.name,
        location: data.location,
        coach: data.coach,
        playerCount: parseInt(data.playerCount) || 0,
        established: data.established,
        logoUrl: data.logoUrl,
      })
      setTeams([...teams, newTeam])
    } catch (err) {
      alert('Failed to add team')
    }
  }

  const handleTeamSubmit = async (data: TeamFormData) => {
    if (editingTeam) {
      try {
        await TeamManager.update(editingTeam.id, {
          name: data.name,
          location: data.location,
          coach: data.coach,
          established: data.established,
          logoUrl: data.logoUrl,
        })
        setTeams(teams.map(t => t.id === editingTeam.id ? {
          ...t,
          name: data.name,
          location: data.location,
          coach: data.coach,
          established: data.established,
          logoUrl: data.logoUrl,
        } : t))
      } catch (err) {
        alert('Failed to update team')
      }
    } else {
      await handleAddTeam(data)
    }
    setShowTeamForm(false)
    setEditingTeam(undefined)
  }

  const handleDeleteTeam = async (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await TeamManager.delete(id)
        setTeams(teams.filter(t => t.id !== id))
      } catch (err) {
        alert('Failed to delete team')
      }
    }
  }

  // Player handlers
  const handleAddPlayer = async (data: PlayerFormData) => {
    try {
      const newPlayer = await PlayerManager.add({
        name: data.name,
        position: data.position,
        team: data.team,
        jerseyNumber: parseInt(data.jerseyNumber),
        height: data.height,
        weight: data.weight,
        photoUrl: data.photoUrl,
      })
      setPlayers([...players, newPlayer])
    } catch (err) {
      alert('Failed to add player')
    }
  }

  const handlePlayerSubmit = async (data: PlayerFormData) => {
    if (editingPlayer) {
      try {
        await PlayerManager.update(editingPlayer.id, {
          name: data.name,
          position: data.position,
          team: data.team,
          jerseyNumber: parseInt(data.jerseyNumber),
          height: data.height,
          weight: data.weight,
          photoUrl: data.photoUrl,
        })
        setPlayers(players.map(p => p.id === editingPlayer.id ? {
          ...p,
          name: data.name,
          position: data.position,
          team: data.team,
          jerseyNumber: parseInt(data.jerseyNumber),
          height: data.height,
          weight: data.weight,
          photoUrl: data.photoUrl,
        } : p))
      } catch (err) {
        alert('Failed to update player')
      }
    } else {
      await handleAddPlayer(data)
    }
    setShowPlayerForm(false)
    setEditingPlayer(undefined)
  }

  const handleDeletePlayer = async (id: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        await PlayerManager.delete(id)
        setPlayers(players.filter(p => p.id !== id))
      } catch (err) {
        alert('Failed to delete player')
      }
    }
  }

  if (FEATURE_FLAGS.USE_SUPABASE && isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading authorization...</p>
        </div>
        <Footer />
      </>
    )
  }

  // Not signed in → show the login form inline (no public login button anywhere).
  if (FEATURE_FLAGS.USE_SUPABASE && !user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-20">
          <span className="kicker mb-4 justify-center">Restricted Area</span>
          <h1 className="mb-8 text-center text-3xl font-bold">Admin Sign-In</h1>
          <LoginCard title="Admin Access" subtitle="Sign in with an administrator account to continue." />
        </main>
        <Footer />
      </>
    )
  }

  // Signed in but not an admin → access denied.
  if (FEATURE_FLAGS.USE_SUPABASE && user!.role !== 'admin') {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-20 text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">Access Denied</h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Your account doesn’t have administrator permissions. If you believe this is a
            mistake, contact a site administrator.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading data...</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              Management Dashboard
            </h1>
            <p className="text-xl opacity-90 text-balance">
              Manage tournaments, teams, and players
            </p>
          </div>
        </section>

        {/* Tabs and Content */}
        <section className="py-16 sm:py-24 bg-background flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b">
              <button
                onClick={() => setActiveTab('tournaments')}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === 'tournaments'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Tournaments ({tournaments.length})
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === 'teams'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Teams ({teams.length})
              </button>
              <button
                onClick={() => setActiveTab('players')}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === 'players'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Players ({players.length})
              </button>
              <button
                onClick={() => setActiveTab('site')}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === 'site'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Site Images
              </button>
            </div>

            {/* Content */}
            {activeTab === 'tournaments' && (
              <div>
                <div className="mb-8">
                  <Button
                    onClick={() => {
                      setEditingTournament(undefined)
                      setShowTournamentForm(true)
                    }}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Tournament
                  </Button>
                </div>
                {tournaments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map(tournament => (
                      <div key={tournament.id} className="relative">
                        <TournamentCard {...tournament} />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => {
                              setEditingTournament(tournament)
                              setShowTournamentForm(true)
                            }}
                            className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTournament(tournament.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No tournaments yet</p>
                )}
              </div>
            )}

            {activeTab === 'teams' && (
              <div>
                <div className="mb-8">
                  <Button
                    onClick={() => {
                      setEditingTeam(undefined)
                      setShowTeamForm(true)
                    }}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Team
                  </Button>
                </div>
                {teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => (
                      <div key={team.id} className="relative">
                        <TeamCard {...team} />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => {
                              setEditingTeam(team)
                              setShowTeamForm(true)
                            }}
                            className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No teams yet</p>
                )}
              </div>
            )}

            {activeTab === 'players' && (
              <div>
                <div className="mb-8">
                  <Button
                    onClick={() => {
                      setEditingPlayer(undefined)
                      setShowPlayerForm(true)
                    }}
                    disabled={teams.length === 0}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Player
                  </Button>
                  {teams.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Create teams first before adding players
                    </p>
                  )}
                </div>
                {players.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.map(player => (
                      <div key={player.id} className="relative">
                        <PlayerCard {...player} />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPlayer(player)
                              setShowPlayerForm(true)
                            }}
                            className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No players yet</p>
                )}
              </div>
            )}

            {activeTab === 'site' && <SiteSettingsManager />}
          </div>
        </section>

        {/* Forms */}
        {showTournamentForm && (
          <TournamentForm
            onClose={() => {
              setShowTournamentForm(false)
              setEditingTournament(undefined)
            }}
            onSubmit={handleTournamentSubmit}
            initialData={editingTournament ? {
              name: editingTournament.name,
              startDate: editingTournament.startDate,
              endDate: editingTournament.endDate,
              location: editingTournament.location,
              status: editingTournament.status,
              teamsCount: editingTournament.teamsCount.toString(),
              imageUrl: editingTournament.imageUrl || '',
            } : undefined}
          />
        )}

        {showTeamForm && (
          <TeamForm
            onClose={() => {
              setShowTeamForm(false)
              setEditingTeam(undefined)
            }}
            onSubmit={handleTeamSubmit}
            initialData={editingTeam ? {
              name: editingTeam.name,
              location: editingTeam.location,
              coach: editingTeam.coach,
              playerCount: editingTeam.playerCount.toString(),
              established: editingTeam.established,
              logoUrl: editingTeam.logoUrl || '',
            } : undefined}
          />
        )}

        {showPlayerForm && (
          <PlayerForm
            onClose={() => {
              setShowPlayerForm(false)
              setEditingPlayer(undefined)
            }}
            onSubmit={handlePlayerSubmit}
            teams={teams.map(t => t.name)}
            initialData={editingPlayer ? {
              name: editingPlayer.name,
              position: editingPlayer.position,
              team: editingPlayer.team,
              jerseyNumber: editingPlayer.jerseyNumber.toString(),
              height: editingPlayer.height,
              weight: editingPlayer.weight,
              photoUrl: editingPlayer.photoUrl,
            } : undefined}
          />
        )}
      </main>
      <Footer />
    </>
  )
}
