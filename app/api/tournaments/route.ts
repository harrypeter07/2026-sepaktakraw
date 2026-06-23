import { NextRequest } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, validateRequest, unauthorized } from '@/lib/api-utils';
import { CreateTournamentRequest } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_date', { ascending: false });

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
      'name',
      'start_date',
      'end_date',
      'location',
      'format',
    ]);

    if (!validation.valid) {
      return validation.error;
    }

    const body: CreateTournamentRequest = validation.data;

    const { data, error } = await supabase
      .from('tournaments')
      .insert([
        {
          name: body.name,
          description: body.description,
          start_date: body.start_date,
          end_date: body.end_date,
          location: body.location,
          format: body.format,
          organizer: body.organizer,
          total_prize_pool: body.total_prize_pool,
          max_teams: body.max_teams,
          created_by: user.id,
          status: 'upcoming',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, 'Tournament created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
