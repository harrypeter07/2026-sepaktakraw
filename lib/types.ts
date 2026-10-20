// Database types matching Supabase schema

export type UserRole = 'admin' | 'tournament_manager' | 'team_manager' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  founded_year: number | null;
  state: string | null;
  logo_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  manager_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type PlayerPosition = 'Tekong' | 'Killer' | 'Feeder' | 'Spiker' | 'Setter' | string;

export interface Player {
  id: string;
  name: string;
  date_of_birth: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  position: PlayerPosition;
  jersey_number: number | null;
  team_id: string;
  user_id: string | null;
  bio: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type TournamentFormat = 'league' | 'knockout' | 'group_stage';
export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string;
  format: TournamentFormat;
  status: TournamentStatus;
  organizer: string | null;
  manager_id: string | null;
  total_prize_pool: number | null;
  max_teams: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentTeam {
  id: string;
  tournament_id: string;
  team_id: string;
  seeding_rank: number | null;
  created_at: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface Match {
  id: string;
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  venue: string | null;
  status: MatchStatus;
  home_score: number;
  away_score: number;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface MatchSet {
  id: string;
  match_id: string;
  set_number: number;
  home_points: number;
  away_points: number;
  created_at: string;
  updated_at: string;
}

export type ArticleCategory = 'news' | 'tournament' | 'team' | 'player' | 'other';

export interface Article {
  id: string;
  title: string;
  content: string;
  category: ArticleCategory | null;
  featured_image_url: string | null;
  published_at: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  user_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  timestamp: string;
}

// Request/Response types for API
export interface CreateTeamRequest {
  name: string;
  description?: string;
  founded_year?: number;
  state?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {
  manager_id?: string | null;
}

export interface CreatePlayerRequest {
  name: string;
  position: PlayerPosition;
  team_id: string;
  date_of_birth?: string;
  height_cm?: number;
  weight_kg?: number;
  jersey_number?: number;
  bio?: string;
  photo_url?: string;
}

export interface UpdatePlayerRequest extends Partial<CreatePlayerRequest> {}

export interface CreateTournamentRequest {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  location: string;
  format: TournamentFormat;
  organizer?: string;
  total_prize_pool?: number;
  max_teams?: number;
}

export interface UpdateTournamentRequest extends Partial<CreateTournamentRequest> {
  status?: TournamentStatus;
  manager_id?: string | null;
}

export interface CreateMatchRequest {
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  venue?: string;
}

export interface UpdateMatchRequest {
  status?: MatchStatus;
  home_score?: number;
  away_score?: number;
  duration_minutes?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type ContactCategory = 'general' | 'join_team' | 'tournament_inquiry' | 'sponsorship' | 'other';
export type ContactStatus = 'pending' | 'read' | 'archived';

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category: ContactCategory;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  category: ContactCategory;
  subject: string;
  message: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface FormSchema {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormSubmission {
  id: string;
  form_id: string;
  answers: Record<string, any>;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}


