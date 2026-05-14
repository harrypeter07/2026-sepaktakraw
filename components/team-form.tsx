'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface TeamFormProps {
  onClose: () => void
  onSubmit: (data: TeamFormData) => void
  initialData?: TeamFormData
}

export interface TeamFormData {
  name: string
  location: string
  coach: string
  playerCount: string
  established: string
}

export function TeamForm({ onClose, onSubmit, initialData }: TeamFormProps) {
  const [formData, setFormData] = useState<TeamFormData>(
    initialData || {
      name: '',
      location: '',
      coach: '',
      playerCount: '',
      established: new Date().getFullYear().toString(),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.location && formData.coach && formData.playerCount) {
      onSubmit(formData)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {initialData ? 'Edit Team' : 'Create Team'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Team Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Coach Name</label>
              <input
                type="text"
                value={formData.coach}
                onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Player Count</label>
              <input
                type="number"
                value={formData.playerCount}
                onChange={(e) => setFormData({ ...formData, playerCount: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Established Year</label>
              <input
                type="number"
                value={formData.established}
                onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {initialData ? 'Update' : 'Create'} Team
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
