'use client'

import { useRouter } from 'next/navigation'
import { TournamentForm, TournamentFormData } from '@/components/tournament-form'
import { TournamentManager } from '@/lib/data-manager'

export default function NewTournamentPage() {
  const router = useRouter()

  const handleSubmit = async (data: TournamentFormData) => {
    try {
      await TournamentManager.add({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        status: data.status as any,
        teamsCount: parseInt(data.teamsCount),
        imageUrl: data.imageUrl,
      })
      router.push('/admin/tournaments')
    } catch (err) {
      alert('Failed to add tournament')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center px-6 shrink-0 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Create Tournament</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm overflow-hidden">
          <TournamentForm
            onClose={() => router.push('/admin/tournaments')}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}
