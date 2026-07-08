'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TeamForm, TeamFormData } from '@/components/team-form'
import { TeamManager, Team } from '@/lib/data-manager'
import { Loader2 } from 'lucide-react'

export default function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const all = await TeamManager.getAll()
        const found = all.find(t => t.id === id)
        if (found) {
          setTeam(found)
        } else {
          alert('Team not found')
          router.push('/admin/teams')
        }
      } catch (err) {
        console.error('Error fetching team:', err)
      } finally {
        setIsLoaded(true)
      }
    }
    loadTeam()
  }, [id, router])

  const handleSubmit = async (data: TeamFormData) => {
    try {
      await TeamManager.update(id, {
        name: data.name,
        location: data.location,
        coach: data.coach,
        established: data.established,
        logoUrl: data.logoUrl,
      })
      router.push('/admin/teams')
    } catch (err) {
      alert('Failed to update team')
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    )
  }

  if (!team) return null

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center px-6 shrink-0 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Edit Team</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm overflow-hidden">
          <TeamForm
            onClose={() => router.push('/admin/teams')}
            onSubmit={handleSubmit}
            initialData={{
              name: team.name,
              location: team.location,
              coach: team.coach,
              playerCount: team.playerCount.toString(),
              established: team.established,
              logoUrl: team.logoUrl || '',
            }}
          />
        </div>
      </main>
    </div>
  )
}
