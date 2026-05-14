'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { TournamentCard } from '@/components/tournament-card'
import { TeamCard } from '@/components/team-card'
import { PlayerCard } from '@/components/player-card'
import { TournamentForm, TournamentFormData } from '@/components/tournament-form'
import { TeamForm, TeamFormData } from '@/components/team-form'
import { PlayerForm, PlayerFormData } from '@/components/player-form'
import { TournamentManager, TeamManager, PlayerManager, Tournament, Team, Player } from '@/lib/data-manager'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'teams' | 'players'>('tournaments')
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

  // Load data
  useEffect(() => {
    setTournaments(TournamentManager.getAll())
    setTeams(TeamManager.getAll())
    setPlayers(PlayerManager.getAll())
    setIsLoaded(true)
  }, [])

  // Tournament handlers
  const handleAddTournament = (data: TournamentFormData) => {
    const newTournament = TournamentManager.add({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      status: data.status,
      teamsCount: parseInt(data.teamsCount),
    })
    setTournaments([...tournaments, newTournament])
  }

  const handleDeleteTournament = (id: string) => {
    TournamentManager.delete(id)
    setTournaments(tournaments.filter(t => t.id !== id))
  }

  // Team handlers
  const handleAddTeam = (data: TeamFormData) => {
    const newTeam = TeamManager.add({
      name: data.name,
      location: data.location,
      coach: data.coach,
      playerCount: parseInt(data.playerCount),
      established: data.established,
    })
    setTeams([...teams, newTeam])
  }

  const handleDeleteTeam = (id: string) => {
    TeamManager.delete(id)
    setTeams(teams.filter(t => t.id !== id))
  }

  // Player handlers
  const handleAddPlayer = (data: PlayerFormData) => {
    const newPlayer = PlayerManager.add({
      name: data.name,
      position: data.position,
      team: data.team,
      jerseyNumber: parseInt(data.jerseyNumber),
      height: data.height,
      weight: data.weight,
    })
    setPlayers([...players, newPlayer])
  }

  const handleDeletePlayer = (id: string) => {
    PlayerManager.delete(id)
    setPlayers(players.filter(p => p.id !== id))
  }

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
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
          </div>
        </section>

        {/* Forms */}
        {showTournamentForm && (
          <TournamentForm
            onClose={() => {
              setShowTournamentForm(false)
              setEditingTournament(undefined)
            }}
            onSubmit={handleAddTournament}
            initialData={editingTournament ? {
              name: editingTournament.name,
              startDate: editingTournament.startDate,
              endDate: editingTournament.endDate,
              location: editingTournament.location,
              status: editingTournament.status,
              teamsCount: editingTournament.teamsCount.toString(),
            } : undefined}
          />
        )}

        {showTeamForm && (
          <TeamForm
            onClose={() => {
              setShowTeamForm(false)
              setEditingTeam(undefined)
            }}
            onSubmit={handleAddTeam}
            initialData={editingTeam ? {
              name: editingTeam.name,
              location: editingTeam.location,
              coach: editingTeam.coach,
              playerCount: editingTeam.playerCount.toString(),
              established: editingTeam.established,
            } : undefined}
          />
        )}

        {showPlayerForm && (
          <PlayerForm
            onClose={() => {
              setShowPlayerForm(false)
              setEditingPlayer(undefined)
            }}
            onSubmit={handleAddPlayer}
            teams={teams.map(t => t.name)}
            initialData={editingPlayer ? {
              name: editingPlayer.name,
              position: editingPlayer.position,
              team: editingPlayer.team,
              jerseyNumber: editingPlayer.jerseyNumber.toString(),
              height: editingPlayer.height,
              weight: editingPlayer.weight,
            } : undefined}
          />
        )}
      </main>
      <Footer />
    </>
  )
}
