import { NextRequest } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase';
import { successResponse, errorResponse, validateRequest, unauthorized } from '@/lib/api-utils';
import { CreateMatchRequest } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get('tournament_id');

    let query = supabase.from('matches').select('*');

    if (tournamentId) {
      query = query.eq('tournament_id', tournamentId);
    }

    const { data, error } = await query.order('match_date', { ascending: true });

    if (error) throw error;

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorized();
    }

    const validation = await validateRequest(req, [
      'tournament_id',
      'home_team_id',
      'away_team_id',
      'match_date',
    ]);

    if (!validation.valid) {
      return validation.error;
    }

    const body: CreateMatchRequest = validation.data;

    // Verify tournament exists and user is manager
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('id, manager_id')
      .eq('id', body.tournament_id)
      .single();

    if (tournamentError || !tournament) {
      return errorResponse('Tournament not found', 404);
    }

    // Check if user is tournament manager or admin
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userRole?.role !== 'admin' && tournament.manager_id !== user.id) {
      return errorResponse('Unauthorized to create matches for this tournament', 403);
    }

    const { data, error } = await supabase
      .from('matches')
      .insert([
        {
          tournament_id: body.tournament_id,
          home_team_id: body.home_team_id,
          away_team_id: body.away_team_id,
          match_date: body.match_date,
          venue: body.venue,
          status: 'scheduled',
          home_score: 0,
          away_score: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, 'Match created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
