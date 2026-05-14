'use client';

import { useState } from 'react';
import { Match } from '@/lib/types';
import { Button } from './ui/button';

interface MatchScorerProps {
  match: Match;
  onUpdate: (homeScore: number, awayScore: number, status: string) => Promise<void>;
  isAdmin?: boolean;
}

export function MatchScorer({ match, onUpdate, isAdmin }: MatchScorerProps) {
  const [homeScore, setHomeScore] = useState(match.home_score);
  const [awayScore, setAwayScore] = useState(match.away_score);
  const [status, setStatus] = useState(match.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleScoreUpdate = async (newHomeScore: number, newAwayScore: number) => {
    setIsUpdating(true);
    try {
      await onUpdate(newHomeScore, newAwayScore, status);
      setHomeScore(newHomeScore);
      setAwayScore(newAwayScore);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdate(homeScore, awayScore, newStatus);
      setStatus(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const isLive = status === 'live';

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      {/* Match Status */}
      <div className="text-center mb-4">
        {isAdmin && (
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="px-3 py-1 rounded border border-input text-sm font-medium"
          >
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )}
        {!isAdmin && (
          <span
            className={`inline-block px-3 py-1 rounded text-sm font-medium ${
              isLive
                ? 'bg-red-100 text-red-800'
                : status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 text-center">
          <p className="text-sm text-muted-foreground mb-2">Home Team</p>
          <div className="text-4xl font-bold text-foreground">{homeScore}</div>
        </div>

        <div className="text-2xl font-bold text-muted-foreground">-</div>

        <div className="flex-1 text-center">
          <p className="text-sm text-muted-foreground mb-2">Away Team</p>
          <div className="text-4xl font-bold text-foreground">{awayScore}</div>
        </div>
      </div>

      {/* Score Controls (Admin only) */}
      {isAdmin && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => handleScoreUpdate(homeScore + 1, awayScore)}
              disabled={isUpdating}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Home +1
            </Button>
            {homeScore > 0 && (
              <Button
                onClick={() => handleScoreUpdate(homeScore - 1, awayScore)}
                disabled={isUpdating}
                variant="outline"
                className="flex-1"
              >
                Home -1
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleScoreUpdate(homeScore, awayScore + 1)}
              disabled={isUpdating}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Away +1
            </Button>
            {awayScore > 0 && (
              <Button
                onClick={() => handleScoreUpdate(homeScore, awayScore - 1)}
                disabled={isUpdating}
                variant="outline"
                className="flex-1"
              >
                Away -1
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Live Indicator */}
      {isLive && (
        <div className="mt-4 flex items-center justify-center gap-2 text-red-600 font-semibold">
          <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          LIVE
        </div>
      )}
    </div>
  );
}
