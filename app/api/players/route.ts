import { NextRequest } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, validateRequest, unauthorized } from '@/lib/api-utils';
import { CreatePlayerRequest } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('team_id');

    let query = supabase.from('players').select('*');

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

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

    const validation = await validateRequest(req, ['name', 'position', 'team_id']);

    if (!validation.valid) {
      return validation.error;
    }

    const body: CreatePlayerRequest = validation.data;

    // Verify team exists and user has access
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, manager_id')
      .eq('id', body.team_id)
      .single();

    if (teamError || !team) {
      return errorResponse('Team not found', 404);
    }

    // Check if user is team manager or admin
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userRole?.role !== 'admin' && team.manager_id !== user.id) {
      return errorResponse('Unauthorized to add players to this team', 403);
    }

    const { data, error } = await supabase
      .from('players')
      .insert([
        {
          name: body.name,
          position: body.position,
          team_id: body.team_id,
          date_of_birth: body.date_of_birth,
          height_cm: body.height_cm,
          weight_kg: body.weight_kg,
          jersey_number: body.jersey_number,
          bio: body.bio,
          photo_url: body.photo_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, 'Player created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
