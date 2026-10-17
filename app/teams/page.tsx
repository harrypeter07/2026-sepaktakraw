import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { TeamsClient } from '@/components/teams-client'
import { TeamManager, PlayerManager } from '@/lib/data-manager'

export const revalidate = 3600 // ISR: Revalidate every hour

export const metadata: Metadata = {
  title: 'Official District Teams & State Squad | Maharashtra Sepaktakraw Association',
  description:
    'Directory of affiliated Sepaktakraw district clubs, senior state squads, coaching staff, and athlete rosters across Maharashtra.',
  alternates: {
    canonical: 'https://sepaktakrawmaharashtra.in/teams',
  },
  openGraph: {
    title: 'Maharashtra Sepaktakraw District Teams & Rosters',
    description:
      'Explore official district teams, coaches, registered players, and state championship squads under MSTA.',
    url: 'https://sepaktakrawmaharashtra.in/teams',
    siteName: 'Maharashtra Sepaktakraw Association',
    type: 'website',
  },
}

export default async function TeamsPage() {
  let teams: any[] = []
  let players: any[] = []

  try {
    const [fetchedTeams, fetchedPlayers] = await Promise.all([
      TeamManager.getAll(),
      PlayerManager.getAll(),
    ])
    teams = fetchedTeams
    players = fetchedPlayers
  } catch (error) {
    console.error('Error loading teams on server:', error)
  }

  // Schema.org SportsTeam collection
  const teamsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Maharashtra Sepaktakraw District Teams',
    itemListElement: teams.map((team, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'SportsTeam',
        name: team.name,
        location: {
          '@type': 'Place',
          name: team.location,
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
        },
        coach: {
          '@type': 'Person',
          name: team.coach,
        },
        memberOf: {
          '@type': 'SportsOrganization',
          name: 'Maharashtra Sepaktakraw Association',
          url: 'https://sepaktakrawmaharashtra.in',
        },
      },
    })),
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamsSchema) }}
      />
      <Navbar />
      <main className="flex-grow">
        <TeamsClient initialTeams={teams} initialPlayers={players} />
      </main>
      <Footer />
    </div>
  )
}
