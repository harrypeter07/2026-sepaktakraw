import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Match } from '@/lib/types';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeMatches(tournamentId?: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let channel: RealtimeChannel;

  useEffect(() => {
    const fetchAndSubscribe = async () => {
      try {
        // Fetch initial data
        let query = supabase.from('matches').select('*');
        
        if (tournamentId) {
          query = query.eq('tournament_id', tournamentId);
        }

        const { data, error: fetchError } = await query.order('match_date', {
          ascending: true,
        });

        if (fetchError) throw fetchError;

        setMatches(data || []);

        // Subscribe to realtime changes
        channel = supabase
          .channel(`matches${tournamentId ? `:${tournamentId}` : ''}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'matches',
              ...(tournamentId && { filter: `tournament_id=eq.${tournamentId}` }),
            },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setMatches((prev) => [...prev, payload.new as Match]);
              } else if (payload.eventType === 'UPDATE') {
                setMatches((prev) =>
                  prev.map((match) =>
                    match.id === payload.new.id ? (payload.new as Match) : match
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                setMatches((prev) => prev.filter((match) => match.id !== payload.old.id));
              }
            }
          )
          .subscribe();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSubscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [tournamentId]);

  return { matches, isLoading, error };
}
