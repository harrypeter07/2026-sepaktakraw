'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlayerForm, PlayerFormData } from '@/components/player-form'
import { PlayerManager, TeamManager, Player } from '@/lib/data-manager'
import { Loader2 } from 'lucide-react'

export default function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [teams, setTeams] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const [allPlayers, allTeams] = await Promise.all([
          PlayerManager.getAll(),
          TeamManager.getAll()
        ])
        
        const found = allPlayers.find(p => p.id === id)
        if (found) {
          setPlayer(found)
        } else {
          alert('Player profile not found')
          router.push('/admin/players')
        }
        
        setTeams(allTeams.map(t => t.name))
      } catch (err) {
        console.error('Error fetching player info:', err)
      } finally {
        setIsLoaded(true)
      }
    }
    loadInfo()
  }, [id, router])

  const handleSubmit = async (data: PlayerFormData) => {
    try {
      await PlayerManager.update(id, {
        name: data.name,
        position: data.position,
        team: data.team,
        jerseyNumber: parseInt(data.jerseyNumber) || 0,
        height: data.height,
        weight: data.weight,
        photoUrl: data.photoUrl,
      })
      router.push('/admin/players')
    } catch (err) {
      alert('Failed to update player')
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    )
  }

  if (!player) return null

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center px-6 shrink-0 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Edit Player Profile</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm overflow-hidden">
          <PlayerForm
            onClose={() => router.push('/admin/players')}
            onSubmit={handleSubmit}
            teams={teams}
            initialData={{
              name: player.name,
              position: player.position,
              team: player.team,
              jerseyNumber: player.jerseyNumber.toString(),
              height: player.height,
              weight: player.weight,
              photoUrl: player.photoUrl,
            }}
          />
        </div>
      </main>
    </div>
  )
}
