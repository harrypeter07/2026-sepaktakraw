'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { CreateTournamentRequest, TournamentFormat } from '@/lib/types';

export default function CreateTournamentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateTournamentRequest>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    format: 'league' as TournamentFormat,
    organizer: '',
    total_prize_pool: undefined,
    max_teams: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create tournament');
      }

      router.push('/tournaments');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Create Tournament</h1>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Tournament Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Maharashtra State Championship 2024"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Tournament details..."
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-foreground mb-2">
                Start Date *
              </label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-foreground mb-2">
                End Date *
              </label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location *
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Pune Sports Complex"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-foreground mb-2">
                Format *
              </label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                <option value="league">League</option>
                <option value="knockout">Knockout</option>
                <option value="group_stage">Group Stage</option>
              </select>
            </div>

            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-foreground mb-2">
                Organizer
              </label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer || ''}
                onChange={handleChange}
                placeholder="Organization name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="max_teams" className="block text-sm font-medium text-foreground mb-2">
                Max Teams
              </label>
              <Input
                id="max_teams"
                name="max_teams"
                type="number"
                value={formData.max_teams || ''}
                onChange={handleChange}
                placeholder="e.g., 16"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="total_prize_pool"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Prize Pool (₹)
              </label>
              <Input
                id="total_prize_pool"
                name="total_prize_pool"
                type="number"
                value={formData.total_prize_pool || ''}
                onChange={handleChange}
                placeholder="e.g., 100000"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Creating...' : 'Create Tournament'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
