import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase';
import { successResponse, errorResponse, validateRequest, unauthorized } from '@/lib/api-utils';
import { CreateTeamRequest } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();

    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorized();
    }

    const validation = await validateRequest(req, ['name']);
    if (!validation.valid) {
      return validation.error;
    }

    const body: CreateTeamRequest = validation.data;

    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          name: body.name,
          description: body.description,
          founded_year: body.founded_year,
          state: body.state,
          logo_url: body.logo_url,
          contact_email: body.contact_email,
          contact_phone: body.contact_phone,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, 'Team created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
