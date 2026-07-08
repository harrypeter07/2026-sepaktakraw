'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TournamentForm, TournamentFormData } from '@/components/tournament-form'
import { TournamentManager, Tournament } from '@/lib/data-manager'
import { Loader2 } from 'lucide-react'

export default function EditTournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadTournament = async () => {
      try {
        const all = await TournamentManager.getAll()
        const found = all.find(t => t.id === id)
        if (found) {
          setTournament(found)
        } else {
          alert('Tournament not found')
          router.push('/admin/tournaments')
        }
      } catch (err) {
        console.error('Error fetching tournament:', err)
      } finally {
        setIsLoaded(true)
      }
    }
    loadTournament()
  }, [id, router])

  const handleSubmit = async (data: TournamentFormData) => {
    try {
      await TournamentManager.update(id, {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        status: data.status as any,
        teamsCount: parseInt(data.teamsCount),
        imageUrl: data.imageUrl,
        description: data.description,
        organizer: data.organizer,
        prizePool: data.prizePool ? parseFloat(data.prizePool) : undefined,
        format: data.format,
      })
      router.push('/admin/tournaments')
    } catch (err) {
      alert('Failed to update tournament')
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    )
  }

  if (!tournament) return null

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center px-6 shrink-0 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Edit Tournament</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm overflow-hidden">
          <TournamentForm
            onClose={() => router.push('/admin/tournaments')}
            onSubmit={handleSubmit}
            initialData={{
              name: tournament.name,
              startDate: tournament.startDate,
              endDate: tournament.endDate,
              location: tournament.location,
              status: tournament.status,
              teamsCount: tournament.teamsCount.toString(),
              imageUrl: tournament.imageUrl || '',
              description: tournament.description || '',
              organizer: tournament.organizer || '',
              prizePool: tournament.prizePool != null ? tournament.prizePool.toString() : '',
              format: tournament.format || 'league',
            }}
          />
        </div>
      </main>
    </div>
  )
}
