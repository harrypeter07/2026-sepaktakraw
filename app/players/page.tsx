'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { PlayerCard } from '@/components/player-card'
import { PageHero } from '@/components/page-hero'
import { PlayerManager, Player } from '@/lib/data-manager'
import { Filter } from 'lucide-react'

const SAMPLE_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    position: 'Spiker',
    team: 'Mumbai Strikers',
    jerseyNumber: 7,
    height: `6'2"`,
    weight: '82 kg',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    position: 'Setter',
    team: 'Pune Eagles',
    jerseyNumber: 3,
    height: `5'8"`,
    weight: '65 kg',
  },
  {
    id: '3',
    name: 'Arun Desai',
    position: 'Blocker',
    team: 'Nagpur Titans',
    jerseyNumber: 12,
    height: `6'3"`,
    weight: '88 kg',
  },
  {
    id: '4',
    name: 'Neha Patel',
    position: 'Libero',
    team: 'Thane Champions',
    jerseyNumber: 1,
    height: `5'6"`,
    weight: '62 kg',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    position: 'Spiker',
    team: 'Aurangabad Warriors',
    jerseyNumber: 8,
    height: `6'1"`,
    weight: '80 kg',
  },
  {
    id: '6',
    name: 'Arjun Verma',
    position: 'Setter',
    team: 'Nashik Blazers',
    jerseyNumber: 2,
    height: `5'10"`,
    weight: '70 kg',
  },
  {
    id: '7',
    name: 'Sneha Gupta',
    position: 'Blocker',
    team: 'Mumbai Strikers',
    jerseyNumber: 11,
    height: `5'11"`,
    weight: '75 kg',
  },
  {
    id: '8',
    name: 'Rohit Joshi',
    position: 'Libero',
    team: 'Pune Eagles',
    jerseyNumber: 4,
    height: `5'9"`,
    weight: '68 kg',
  },
  {
    id: '9',
    name: 'Maya Nair',
    position: 'Spiker',
    team: 'Nagpur Titans',
    jerseyNumber: 5,
    height: `5'10"`,
    weight: '72 kg',
  },
]

export default function PlayersPage() {
  const [filterPosition, setFilterPosition] = useState<string>('all')
  const [filterTeam, setFilterTeam] = useState<string>('all')
  const [players, setPlayers] = useState(SAMPLE_PLAYERS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const customPlayers = await PlayerManager.getAll()
        if (customPlayers.length > 0) {
          setPlayers(customPlayers)
        } else {
          setPlayers(SAMPLE_PLAYERS)
        }
      } catch (err) {
        console.error('Error loading players:', err)
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

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        {/* Hero */}
        <PageHero
          imageKey="players.hero.image"
          kicker="Elite Athletes"
          title="Players"
          subtitle="Discover elite Sepaktakraw athletes"
        />

        {/* Filters */}
        <section className="py-6 bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Filter size={14} /> Filter by Position
                </label>
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Positions</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Filter size={14} /> Filter by Team
                </label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Teams</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Players Grid */}
        <section className="py-16 sm:py-24 bg-background flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlayers.map(player => (
                  <PlayerCard key={player.id} {...player} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No players found matching your filters
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
