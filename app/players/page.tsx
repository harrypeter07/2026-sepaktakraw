import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { PlayersClient } from '@/components/players-client'
import { PlayerManager } from '@/lib/data-manager'

export const revalidate = 3600 // ISR: Revalidate every hour

export const metadata: Metadata = {
  title: 'Elite Athletes & State URN Registry | Maharashtra Sepaktakraw Association',
  description:
    'Official registry of 191+ verified Sepaktakraw athletes in Maharashtra. Search players by URN ID, position (Tekong, Killer, Feeder, Spiker), district, and division.',
  alternates: {
    canonical: 'https://sepaktakrawmaharashtra.in/players',
  },
  openGraph: {
    title: 'Maharashtra Sepaktakraw Athlete Roster & State URN Registry',
    description:
      'Search official state roster, verified URN registration numbers, and athlete profiles representing Maharashtra Sepaktakraw.',
    url: 'https://sepaktakrawmaharashtra.in/players',
    siteName: 'Maharashtra Sepaktakraw Association',
    type: 'website',
  },
}

export default async function PlayersPage() {
  let players: any[] = []

  try {
    players = await PlayerManager.getAll()
  } catch (error) {
    console.error('Error loading players on server:', error)
  }

  // Schema.org ItemList of athletes
  const athletesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Maharashtra Sepaktakraw Official Athletes',
    numberOfItems: players.length,
    itemListElement: players.slice(0, 30).map((player, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Person',
        name: player.name,
        jobTitle: `${player.position} - Sepaktakraw Athlete`,
        memberOf: {
          '@type': 'SportsTeam',
          name: player.team,
        },
      },
    })),
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(athletesSchema) }}
      />
      <Navbar />
      <main className="flex-grow">
        <PlayersClient initialPlayers={players} />
      </main>
      <Footer />
    </div>
  )
}
