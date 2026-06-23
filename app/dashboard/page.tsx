'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface DashboardStats {
  totalTeams: number;
  totalPlayers: number;
  totalTournaments: number;
  activeMatches: number;
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    totalPlayers: 0,
    totalTournaments: 0,
    activeMatches: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teamsRes, playersRes, tournamentsRes, matchesRes] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/players'),
          fetch('/api/tournaments'),
          fetch('/api/matches'),
        ]);

        const teamsData = await teamsRes.json();
        const playersData = await playersRes.json();
        const tournamentsData = await tournamentsRes.json();
        const matchesData = await matchesRes.json();

        setStats({
          totalTeams: teamsData.data?.length || 0,
          totalPlayers: playersData.data?.length || 0,
          totalTournaments: tournamentsData.data?.length || 0,
          activeMatches: matchesData.data?.filter((m: any) => m.status === 'live').length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user.full_name || user.email}! ({user.role})
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Teams</div>
            <div className="text-3xl font-bold text-foreground">
              {isLoadingStats ? '-' : stats.totalTeams}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Players</div>
            <div className="text-3xl font-bold text-foreground">
              {isLoadingStats ? '-' : stats.totalPlayers}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Tournaments</div>
            <div className="text-3xl font-bold text-foreground">
              {isLoadingStats ? '-' : stats.totalTournaments}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Live Matches</div>
            <div className="text-3xl font-bold text-accent">
              {isLoadingStats ? '-' : stats.activeMatches}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.role === 'admin' && (
            <>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Admin Tools</h2>
                <div className="space-y-3">
                  <Link href="/admin?tab=teams">
                    <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
                      Manage Teams
                    </Button>
                  </Link>
                  <Link href="/admin?tab=tournaments">
                    <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
                      Manage Tournaments
                    </Button>
                  </Link>
                  <Link href="/admin?tab=players">
                    <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
                      Manage Players
                    </Button>
                  </Link>
                </div>
              </Card>
            </>
          )}

          {(user.role === 'tournament_manager' || user.role === 'admin') && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Tournament Management</h2>
              <div className="space-y-3">
                <Link href="/tournaments">
                  <Button className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    View Tournaments
                  </Button>
                </Link>
                <Link href="/dashboard/create-tournament">
                  <Button className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Create Tournament
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {(user.role === 'team_manager' || user.role === 'admin') && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Team Management</h2>
              <div className="space-y-3">
                <Link href="/teams">
                  <Button className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    View Teams
                  </Button>
                </Link>
                <Link href="/dashboard/create-team">
                  <Button className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Create Team
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Explore</h2>
            <div className="space-y-3">
              <Link href="/tournaments">
                <Button className="w-full justify-start bg-muted text-muted-foreground hover:bg-muted/80">
                  View Tournaments
                </Button>
              </Link>
              <Link href="/teams">
                <Button className="w-full justify-start bg-muted text-muted-foreground hover:bg-muted/80">
                  View Teams
                </Button>
              </Link>
              <Link href="/players">
                <Button className="w-full justify-start bg-muted text-muted-foreground hover:bg-muted/80">
                  View Players
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
