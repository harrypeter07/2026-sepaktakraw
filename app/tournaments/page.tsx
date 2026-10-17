import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { TournamentsClient } from '@/components/tournaments-client'
import { TournamentManager, TeamManager } from '@/lib/data-manager'

export const revalidate = 3600 // ISR: Revalidate every hour

export const metadata: Metadata = {
  title: 'State Championships & Tournaments | Maharashtra Sepaktakraw Association',
  description:
    'Explore official tournaments, national qualifiers, district championships, and podium records of the Maharashtra Sepaktakraw Association (MSTA). View schedules, venues, and live results.',
  alternates: {
    canonical: 'https://sepaktakrawmaharashtra.in/tournaments',
  },
  openGraph: {
    title: 'Sepaktakraw Tournaments & Championships - Maharashtra',
    description:
      'Official Maharashtra Sepaktakraw tournament schedules, participating district teams, format details, and historical medal records.',
    url: 'https://sepaktakrawmaharashtra.in/tournaments',
    siteName: 'Maharashtra Sepaktakraw Association',
    type: 'website',
  },
}

export default async function TournamentsPage() {
  let tournaments: any[] = []
  let teams: any[] = []

  try {
    const [fetchedTournaments, fetchedTeams] = await Promise.all([
      TournamentManager.getAll(),
      TeamManager.getAll(),
    ])
    tournaments = fetchedTournaments
    teams = fetchedTeams
  } catch (error) {
    console.error('Error loading tournaments on server:', error)
  }

  // Generate Schema.org JSON-LD for SportsEvents
  const tournamentsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tournaments.map((t, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'SportsEvent',
        name: t.name,
        startDate: t.startDate,
        endDate: t.endDate,
        eventStatus:
          t.status === 'completed'
            ? 'https://schema.org/EventScheduled'
            : t.status === 'ongoing'
            ? 'https://schema.org/EventMovedOnline'
            : 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: t.location,
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
        },
        organizer: {
          '@type': 'SportsOrganization',
          name: t.organizer || 'Maharashtra Sepaktakraw Association',
          url: 'https://sepaktakrawmaharashtra.in',
        },
        description: t.description || `${t.name} organized by MSTA.`,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tournamentsSchema) }}
      />
      <Navbar />
      <main className="flex-grow">
        <TournamentsClient initialTournaments={tournaments} initialTeams={teams} />
      </main>
      <Footer />
    </div>
  )
}
