'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { CreateTeamRequest } from '@/lib/types';

export default function CreateTeamPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: '',
    description: '',
    founded_year: undefined,
    state: '',
    contact_email: '',
    contact_phone: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'founded_year' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create team');
      }

      router.push('/teams');
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
        <h1 className="text-3xl font-bold text-foreground mb-6">Create Team</h1>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Team Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Pune Warriors"
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
              placeholder="Team description..."
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="founded_year" className="block text-sm font-medium text-foreground mb-2">
                Founded Year
              </label>
              <Input
                id="founded_year"
                name="founded_year"
                type="number"
                value={formData.founded_year || ''}
                onChange={handleChange}
                placeholder="e.g., 2015"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                State
              </label>
              <Input
                id="state"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                placeholder="e.g., Maharashtra"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-foreground mb-2">
              Contact Email
            </label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              value={formData.contact_email || ''}
              onChange={handleChange}
              placeholder="contact@team.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-foreground mb-2">
              Contact Phone
            </label>
            <Input
              id="contact_phone"
              name="contact_phone"
              value={formData.contact_phone || ''}
              onChange={handleChange}
              placeholder="+91 9876543210"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Creating...' : 'Create Team'}
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
