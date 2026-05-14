'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { TournamentCard } from '@/components/tournament-card'
import { Button } from '@/components/ui/button'
import { TournamentManager } from '@/lib/data-manager'

const SAMPLE_TOURNAMENTS = [
  {
    id: '1',
    name: 'Maharashtra Premier League 2025',
    startDate: 'Jan 15',
    endDate: 'Feb 28',
    location: 'Mumbai, Maharashtra',
    status: 'ongoing' as const,
    teamsCount: 12,
  },
  {
    id: '2',
    name: 'University Championship',
    startDate: 'Mar 1',
    endDate: 'Mar 20',
    location: 'Pune, Maharashtra',
    status: 'upcoming' as const,
    teamsCount: 18,
  },
  {
    id: '3',
    name: 'Regional Cup 2024',
    startDate: 'Oct 10',
    endDate: 'Nov 15',
    location: 'Nagpur, Maharashtra',
    status: 'completed' as const,
    teamsCount: 16,
  },
  {
    id: '4',
    name: 'Youth Development Cup',
    startDate: 'Apr 5',
    endDate: 'Apr 25',
    location: 'Aurangabad, Maharashtra',
    status: 'upcoming' as const,
    teamsCount: 14,
  },
  {
    id: '5',
    name: 'Intercity Challenge',
    startDate: 'May 1',
    endDate: 'May 30',
    location: 'Thane, Maharashtra',
    status: 'upcoming' as const,
    teamsCount: 10,
  },
  {
    id: '6',
    name: 'Winter Championship 2024',
    startDate: 'Dec 1',
    endDate: 'Dec 20',
    location: 'Mumbai, Maharashtra',
    status: 'completed' as const,
    teamsCount: 20,
  },
]

export default function TournamentsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all')
  const [tournaments, setTournaments] = useState(SAMPLE_TOURNAMENTS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const customTournaments = TournamentManager.getAll()
    if (customTournaments.length > 0) {
      setTournaments(customTournaments)
    } else {
      setTournaments(SAMPLE_TOURNAMENTS)
    }
    setIsLoaded(true)
  }, [])

  const filteredTournaments = filterStatus === 'all'
    ? tournaments
    : tournaments.filter(t => t.status === filterStatus)

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              Tournaments
            </h1>
            <p className="text-xl opacity-90 text-balance">
              Explore upcoming, ongoing, and completed tournaments
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="py-8 bg-card border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filterStatus === 'all'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All Tournaments
              </button>
              <button
                onClick={() => setFilterStatus('upcoming')}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filterStatus === 'upcoming'
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterStatus('ongoing')}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filterStatus === 'ongoing'
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filterStatus === 'completed'
                    ? 'bg-gray-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </section>

        {/* Tournaments Grid */}
        <section className="py-16 sm:py-24 bg-background flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map(tournament => (
                  <TournamentCard key={tournament.id} {...tournament} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No tournaments found for this filter
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
