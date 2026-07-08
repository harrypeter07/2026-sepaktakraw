'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlayerManager, TeamManager, Player } from '@/lib/data-manager'
import { PlayerCard } from '@/components/player-card'
import { Button } from '@/components/ui/button'
import { User, Plus, Edit2, Trash2, Loader2, Link2 } from 'lucide-react'

export default function PlayersAdminPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [hasTeams, setHasTeams] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const loadData = async () => {
    try {
      const [playersData, teamsData] = await Promise.all([
        PlayerManager.getAll(),
        TeamManager.getAll()
      ])
      setPlayers(playersData)
      setHasTeams(teamsData.length > 0)
    } catch (err) {
      console.error('Error loading players:', err)
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        await PlayerManager.delete(id)
        setPlayers(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        alert('Failed to delete player')
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Topbar Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div>
          <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Players Manager</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 transition flex items-center gap-1"
          >
            <Link2 size={12} />
            View Website
          </Link>
          <Button 
            disabled={!hasTeams}
            asChild={hasTeams} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-9 text-xs disabled:opacity-50"
          >
            {hasTeams ? (
              <Link href="/admin/players/new" className="flex items-center gap-1">
                <Plus size={14} /> Add Player
              </Link>
            ) : (
              <span>Add Player</span>
            )}
          </Button>
        </div>
      </header>

      {/* Main content view */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        {!hasTeams && isLoaded && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm font-semibold flex items-center gap-2">
            Create teams first before adding players.
          </div>
        )}

        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-3" />
            <p className="text-sm font-semibold">Loading players...</p>
          </div>
        ) : players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map(player => (
              <div key={player.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <PlayerCard {...player} />
                <div className="border-t p-4 flex gap-2 bg-slate-50">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs"
                  >
                    <Link href={`/admin/players/${player.id}`}>
                      <Edit2 size={12} /> Edit Profile
                    </Link>
                  </Button>
                  <Button
                    onClick={() => handleDelete(player.id)}
                    variant="destructive"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs"
                  >
                    <Trash2 size={12} /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border bg-white rounded-xl text-slate-400">
            <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="font-semibold text-slate-500">No Players Registered</p>
            <p className="text-xs mt-1">Click "Add Player" to register a player.</p>
          </div>
        )}
      </div>
    </div>
  )
}
