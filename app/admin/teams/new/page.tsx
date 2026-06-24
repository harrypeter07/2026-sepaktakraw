'use client'

import { useRouter } from 'next/navigation'
import { TeamForm, TeamFormData } from '@/components/team-form'
import { TeamManager } from '@/lib/data-manager'

export default function NewTeamPage() {
  const router = useRouter()

  const handleSubmit = async (data: TeamFormData) => {
    try {
      await TeamManager.add({
        name: data.name,
        location: data.location,
        coach: data.coach,
        playerCount: parseInt(data.playerCount) || 0,
        established: data.established,
        logoUrl: data.logoUrl,
      })
      router.push('/admin/teams')
    } catch (err) {
      alert('Failed to add team')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center px-6 shrink-0 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Create Team</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm overflow-hidden">
          <TeamForm
            onClose={() => router.push('/admin/teams')}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}
