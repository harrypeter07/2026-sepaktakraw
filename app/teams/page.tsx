'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { TeamCard } from '@/components/team-card'
import { PageHero } from '@/components/page-hero'
import { useState, useEffect } from 'react'
import { TeamManager } from '@/lib/data-manager'
import { Search } from 'lucide-react'

const SAMPLE_TEAMS = [
  {
    id: '1',
    name: 'Mumbai Strikers',
    location: 'Mumbai',
    coach: 'Rajesh Kumar',
    playerCount: 14,
    established: '2020',
  },
  {
    id: '2',
    name: 'Pune Eagles',
    location: 'Pune',
    coach: 'Priya Sharma',
    playerCount: 16,
    established: '2019',
  },
  {
    id: '3',
    name: 'Nagpur Titans',
    location: 'Nagpur',
    coach: 'Arun Desai',
    playerCount: 15,
    established: '2021',
  },
  {
    id: '4',
    name: 'Aurangabad Warriors',
    location: 'Aurangabad',
    coach: 'Vikram Singh',
    playerCount: 13,
    established: '2022',
  },
  {
    id: '5',
    name: 'Thane Champions',
    location: 'Thane',
    coach: 'Neha Patel',
    playerCount: 14,
    established: '2020',
  },
  {
    id: '6',
    name: 'Nashik Blazers',
    location: 'Nashik',
    coach: 'Arjun Verma',
    playerCount: 12,
    established: '2023',
  },
]

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [teams, setTeams] = useState(SAMPLE_TEAMS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const customTeams = await TeamManager.getAll()
        if (customTeams.length > 0) {
          setTeams(customTeams)
        } else {
          setTeams(SAMPLE_TEAMS)
        }
      } catch (err) {
        console.error('Error loading teams:', err)
      } finally {
        setIsLoaded(true)
      }
    }
    loadTeams()
  }, [])

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        {/* Hero */}
        <PageHero
          imageKey="teams.hero.image"
          kicker="Competitive Clubs"
          title="Teams"
          subtitle="Meet the competitive teams across Maharashtra"
        />

        {/* Search */}
        <section className="py-6 bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search teams by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Teams Grid */}
        <section className="py-16 sm:py-24 bg-background flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map(team => (
                  <TeamCard key={team.id} {...team} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No teams found matching your search
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
