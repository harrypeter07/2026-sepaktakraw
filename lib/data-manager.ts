import { FEATURE_FLAGS } from './feature-flags'
import { supabase } from './supabase'
import { ContactResponse, ContactStatus, FormSubmission } from './types'

// Types
export interface Tournament {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  status: 'upcoming' | 'ongoing' | 'completed'
  teamsCount: number
  imageUrl?: string
}

export interface Team {
  id: string
  name: string
  location: string
  coach: string
  playerCount: number
  established: string
  logoUrl?: string
}

export interface Player {
  id: string
  name: string
  position: string
  team: string
  jerseyNumber: number
  height?: string
  weight?: string
  photoUrl?: string
}

// LocalStorage Keys
const TOURNAMENTS_KEY = 'msa_tournaments'
const TEAMS_KEY = 'msa_teams'
const PLAYERS_KEY = 'msa_players'

const SAMPLE_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    name: 'Maharashtra Premier League 2025',
    startDate: 'Jan 15',
    endDate: 'Feb 28',
    location: 'Mumbai, Maharashtra',
    status: 'ongoing',
    teamsCount: 12,
  },
  {
    id: '2',
    name: 'University Championship',
    startDate: 'Mar 1',
    endDate: 'Mar 20',
    location: 'Pune, Maharashtra',
    status: 'upcoming',
    teamsCount: 18,
  },
  {
    id: '3',
    name: 'Regional Cup 2024',
    startDate: 'Oct 10',
    endDate: 'Nov 15',
    location: 'Nagpur, Maharashtra',
    status: 'completed',
    teamsCount: 16,
  },
  {
    id: '4',
    name: 'Youth Development Cup',
    startDate: 'Apr 5',
    endDate: 'Apr 25',
    location: 'Aurangabad, Maharashtra',
    status: 'upcoming',
    teamsCount: 14,
  },
  {
    id: '5',
    name: 'Intercity Challenge',
    startDate: 'May 1',
    endDate: 'May 30',
    location: 'Thane, Maharashtra',
    status: 'upcoming',
    teamsCount: 10,
  },
  {
    id: '6',
    name: 'Winter Championship 2024',
    startDate: 'Dec 1',
    endDate: 'Dec 20',
    location: 'Mumbai, Maharashtra',
    status: 'completed',
    teamsCount: 20,
  },
]

const SAMPLE_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Mumbai Strikers',
    location: 'Mumbai',
    coach: 'Rajesh Kumar',
    playerCount: 14,
    established: '2020',
  },
  {
    id: '2',
    name: 'Pune Eagles',
    location: 'Pune',
    coach: 'Priya Sharma',
    playerCount: 16,
    established: '2019',
  },
  {
    id: '3',
    name: 'Nagpur Titans',
    location: 'Nagpur',
    coach: 'Arun Desai',
    playerCount: 15,
    established: '2021',
  },
  {
    id: '4',
    name: 'Aurangabad Warriors',
    location: 'Aurangabad',
    coach: 'Vikram Singh',
    playerCount: 13,
    established: '2022',
  },
  {
    id: '5',
    name: 'Thane Champions',
    location: 'Thane',
    coach: 'Neha Patel',
    playerCount: 14,
    established: '2020',
  },
  {
    id: '6',
    name: 'Nashik Blazers',
    location: 'Nashik',
    coach: 'Arjun Verma',
    playerCount: 12,
    established: '2023',
  },
]

const SAMPLE_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    position: 'Spiker',
    team: 'Mumbai Strikers',
    jerseyNumber: 7,
    height: `6'2"`,
    weight: '82 kg',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    position: 'Setter',
    team: 'Pune Eagles',
    jerseyNumber: 3,
    height: `5'8"`,
    weight: '65 kg',
  },
  {
    id: '3',
    name: 'Arun Desai',
    position: 'Blocker',
    team: 'Nagpur Titans',
    jerseyNumber: 12,
    height: `6'3"`,
    weight: '88 kg',
  },
  {
    id: '4',
    name: 'Neha Patel',
    position: 'Libero',
    team: 'Thane Champions',
    jerseyNumber: 1,
    height: `5'6"`,
    weight: '62 kg',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    position: 'Spiker',
    team: 'Aurangabad Warriors',
    jerseyNumber: 8,
    height: `6'1"`,
    weight: '80 kg',
  },
  {
    id: '6',
    name: 'Arjun Verma',
    position: 'Setter',
    team: 'Nashik Blazers',
    jerseyNumber: 2,
    height: `5'10"`,
    weight: '70 kg',
  },
  {
    id: '7',
    name: 'Sneha Gupta',
    position: 'Blocker',
    team: 'Mumbai Strikers',
    jerseyNumber: 11,
    height: `5'11"`,
    weight: '75 kg',
  },
  {
    id: '8',
    name: 'Rohit Joshi',
    position: 'Libero',
    team: 'Pune Eagles',
    jerseyNumber: 4,
    height: `5'9"`,
    weight: '68 kg',
  },
  {
    id: '9',
    name: 'Maya Nair',
    position: 'Spiker',
    team: 'Nagpur Titans',
    jerseyNumber: 5,
    height: `5'10"`,
    weight: '72 kg',
  },
]

// Helper for localStorage fallback
const getLocal = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(key)
  
  if (!data) {
    if (key === TOURNAMENTS_KEY) {
      localStorage.setItem(key, JSON.stringify(SAMPLE_TOURNAMENTS))
      return SAMPLE_TOURNAMENTS as any
    }
    if (key === TEAMS_KEY) {
      localStorage.setItem(key, JSON.stringify(SAMPLE_TEAMS))
      return SAMPLE_TEAMS as any
    }
    if (key === PLAYERS_KEY) {
      localStorage.setItem(key, JSON.stringify(SAMPLE_PLAYERS))
      return SAMPLE_PLAYERS as any
    }
  }
  
  return data ? JSON.parse(data) : []
}

const setLocal = <T>(key: string, data: T[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// Tournament Management
export const TournamentManager = {
  getAll: async (): Promise<Tournament[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .order('start_date', { ascending: false })

        if (error) throw error

        return (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          startDate: item.start_date,
          endDate: item.end_date,
          location: item.location,
          status: item.status,
          teamsCount: item.max_teams || 0,
          imageUrl: item.image_url || '',
        }))
      } catch (err) {
        console.error('Error fetching tournaments from Supabase, falling back to local storage:', err)
      }
    }

    return getLocal<Tournament>(TOURNAMENTS_KEY)
  },

  add: async (tournament: Omit<Tournament, 'id'>): Promise<Tournament> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) throw new Error('Unauthenticated')

        const { data, error } = await supabase
          .from('tournaments')
          .insert([
            {
              name: tournament.name,
              start_date: tournament.startDate,
              end_date: tournament.endDate,
              location: tournament.location,
              status: tournament.status,
              max_teams: tournament.teamsCount,
              created_by: user.id,
              format: 'league', // Default required field
              image_url: tournament.imageUrl || null,
            },
          ])
          .select()
          .single()

        if (error) throw error

        return {
          id: data.id,
          name: data.name,
          startDate: data.start_date,
          endDate: data.end_date,
          location: data.location,
          status: data.status,
          teamsCount: data.max_teams || 0,
          imageUrl: data.image_url || '',
        }
      } catch (err) {
        console.error('Error adding tournament to Supabase:', err)
        throw err
      }
    }

    const tournaments = getLocal<Tournament>(TOURNAMENTS_KEY)
    const newTournament: Tournament = {
      ...tournament,
      id: Date.now().toString(),
    }
    tournaments.push(newTournament)
    setLocal(TOURNAMENTS_KEY, tournaments)
    return newTournament
  },

  update: async (id: string, updates: Partial<Tournament>): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const mappedUpdates: any = {}
        if (updates.name !== undefined) mappedUpdates.name = updates.name
        if (updates.startDate !== undefined) mappedUpdates.start_date = updates.startDate
        if (updates.endDate !== undefined) mappedUpdates.end_date = updates.endDate
        if (updates.location !== undefined) mappedUpdates.location = updates.location
        if (updates.status !== undefined) mappedUpdates.status = updates.status
        if (updates.teamsCount !== undefined) mappedUpdates.max_teams = updates.teamsCount
        if (updates.imageUrl !== undefined) mappedUpdates.image_url = updates.imageUrl || null

        const { error } = await supabase
          .from('tournaments')
          .update(mappedUpdates)
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error updating tournament in Supabase:', err)
        throw err
      }
    }

    const tournaments = getLocal<Tournament>(TOURNAMENTS_KEY)
    const index = tournaments.findIndex(t => t.id === id)
    if (index !== -1) {
      tournaments[index] = { ...tournaments[index], ...updates }
      setLocal(TOURNAMENTS_KEY, tournaments)
    }
  },

  delete: async (id: string): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from('tournaments')
          .delete()
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error deleting tournament from Supabase:', err)
        throw err
      }
    }

    const tournaments = getLocal<Tournament>(TOURNAMENTS_KEY)
    const filtered = tournaments.filter(t => t.id !== id)
    setLocal(TOURNAMENTS_KEY, filtered)
  },
}

// Team Management
export const TeamManager = {
  getAll: async (): Promise<Team[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*, players(count)')
          .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          location: item.state || '',
          coach: item.coach || '',
          playerCount: item.players?.[0]?.count || 0,
          established: item.founded_year?.toString() || '',
          logoUrl: item.logo_url || '',
        }))
      } catch (err) {
        console.error('Error fetching teams from Supabase, falling back to local storage:', err)
      }
    }

    return getLocal<Team>(TEAMS_KEY)
  },

  add: async (team: Omit<Team, 'id'>): Promise<Team> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) throw new Error('Unauthenticated')

        const { data, error } = await supabase
          .from('teams')
          .insert([
            {
              name: team.name,
              state: team.location,
              coach: team.coach,
              founded_year: team.established ? parseInt(team.established) : null,
              created_by: user.id,
              logo_url: team.logoUrl || null,
            },
          ])
          .select()
          .single()

        if (error) throw error

        return {
          id: data.id,
          name: data.name,
          location: data.state || '',
          coach: data.coach || '',
          playerCount: 0,
          established: data.founded_year?.toString() || '',
          logoUrl: data.logo_url || '',
        }
      } catch (err) {
        console.error('Error adding team to Supabase:', err)
        throw err
      }
    }

    const teams = getLocal<Team>(TEAMS_KEY)
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
    }
    teams.push(newTeam)
    setLocal(TEAMS_KEY, teams)
    return newTeam
  },

  update: async (id: string, updates: Partial<Team>): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const mappedUpdates: any = {}
        if (updates.name !== undefined) mappedUpdates.name = updates.name
        if (updates.location !== undefined) mappedUpdates.state = updates.location
        if (updates.coach !== undefined) mappedUpdates.coach = updates.coach
        if (updates.established !== undefined) {
          mappedUpdates.founded_year = updates.established ? parseInt(updates.established) : null
        }
        if (updates.logoUrl !== undefined) mappedUpdates.logo_url = updates.logoUrl || null

        const { error } = await supabase
          .from('teams')
          .update(mappedUpdates)
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error updating team in Supabase:', err)
        throw err
      }
    }

    const teams = getLocal<Team>(TEAMS_KEY)
    const index = teams.findIndex(t => t.id === id)
    if (index !== -1) {
      teams[index] = { ...teams[index], ...updates }
      setLocal(TEAMS_KEY, teams)
    }
  },

  delete: async (id: string): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from('teams')
          .delete()
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error deleting team from Supabase:', err)
        throw err
      }
    }

    const teams = getLocal<Team>(TEAMS_KEY)
    const filtered = teams.filter(t => t.id !== id)
    setLocal(TEAMS_KEY, filtered)
  },
}

// Player Management
export const PlayerManager = {
  getAll: async (): Promise<Player[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*, teams(name)')
          .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          position: item.position,
          team: item.teams?.name || '',
          jerseyNumber: item.jersey_number || 0,
          height: item.height || '',
          weight: item.weight || '',
          photoUrl: item.photo_url || '',
        }))
      } catch (err) {
        console.error('Error fetching players from Supabase, falling back to local storage:', err)
      }
    }

    return getLocal<Player>(PLAYERS_KEY)
  },

  add: async (player: Omit<Player, 'id'>): Promise<Player> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        // Find team ID by name
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('id')
          .eq('name', player.team)
          .single()

        if (teamError || !teamData) {
          throw new Error(`Team not found: ${player.team}`)
        }

        const { data, error } = await supabase
          .from('players')
          .insert([
            {
              name: player.name,
              position: player.position,
              team_id: teamData.id,
              jersey_number: player.jerseyNumber,
              height: player.height,
              weight: player.weight,
              photo_url: player.photoUrl || null,
            },
          ])
          .select()
          .single()

        if (error) throw error

        return {
          id: data.id,
          name: data.name,
          position: data.position,
          team: player.team,
          jerseyNumber: data.jersey_number,
          height: data.height || '',
          weight: data.weight || '',
          photoUrl: data.photo_url || '',
        }
      } catch (err) {
        console.error('Error adding player to Supabase:', err)
        throw err
      }
    }

    const players = getLocal<Player>(PLAYERS_KEY)
    const newPlayer: Player = {
      ...player,
      id: Date.now().toString(),
    }
    players.push(newPlayer)
    setLocal(PLAYERS_KEY, players)
    return newPlayer
  },

  update: async (id: string, updates: Partial<Player>): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const mappedUpdates: any = {}
        if (updates.name !== undefined) mappedUpdates.name = updates.name
        if (updates.position !== undefined) mappedUpdates.position = updates.position
        if (updates.jerseyNumber !== undefined) mappedUpdates.jersey_number = updates.jerseyNumber
        if (updates.height !== undefined) mappedUpdates.height = updates.height
        if (updates.weight !== undefined) mappedUpdates.weight = updates.weight
        if (updates.photoUrl !== undefined) mappedUpdates.photo_url = updates.photoUrl || null

        if (updates.team !== undefined) {
          // Find team ID by name
          const { data: teamData } = await supabase
            .from('teams')
            .select('id')
            .eq('name', updates.team)
            .single()

          if (teamData) {
            mappedUpdates.team_id = teamData.id
          }
        }

        const { error } = await supabase
          .from('players')
          .update(mappedUpdates)
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error updating player in Supabase:', err)
        throw err
      }
    }

    const players = getLocal<Player>(PLAYERS_KEY)
    const index = players.findIndex(p => p.id === id)
    if (index !== -1) {
      players[index] = { ...players[index], ...updates }
      setLocal(PLAYERS_KEY, players)
    }
  },

  delete: async (id: string): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from('players')
          .delete()
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error deleting player from Supabase:', err)
        throw err
      }
    }

    const players = getLocal<Player>(PLAYERS_KEY)
    const filtered = players.filter(p => p.id !== id)
    setLocal(PLAYERS_KEY, filtered)
  },

  getByTeam: async (team: string): Promise<Player[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        // Filter at the database via the joined team name instead of pulling
        // every player into memory and filtering client-side.
        const { data, error } = await supabase
          .from('players')
          .select('*, teams!inner(name)')
          .eq('teams.name', team)
          .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          position: item.position,
          team: item.teams?.name || '',
          jerseyNumber: item.jersey_number || 0,
          height: item.height || '',
          weight: item.weight || '',
        }))
      } catch (err) {
        console.error('Error fetching players by team from Supabase, falling back to local filter:', err)
      }
    }

    const players = await PlayerManager.getAll()
    return players.filter(p => p.team === team)
  },
}

// Contact Response Management
const CONTACT_RESPONSES_KEY = 'msa_contact_responses'

export const ContactResponseManager = {
  getAll: async (): Promise<ContactResponse[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('contact_responses')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone || '',
          category: item.category,
          subject: item.subject,
          message: item.message,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }))
      } catch (err) {
        console.error('Error fetching contact responses from Supabase, falling back to local storage:', err)
      }
    }

    return getLocal<ContactResponse>(CONTACT_RESPONSES_KEY)
  },

  add: async (response: Omit<ContactResponse, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ContactResponse> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('contact_responses')
          .insert([
            {
              name: response.name,
              email: response.email,
              phone: response.phone || null,
              category: response.category,
              subject: response.subject,
              message: response.message,
              status: 'pending',
            },
          ])
          .select()
          .single()

        if (error) throw error

        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          category: data.category,
          subject: data.subject,
          message: data.message,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
        }
      } catch (err) {
        console.error('Error adding contact response to Supabase:', err)
        throw err
      }
    }

    const responses = getLocal<ContactResponse>(CONTACT_RESPONSES_KEY)
    const newResponse: ContactResponse = {
      ...response,
      id: Date.now().toString(),
      status: 'pending',
      phone: response.phone || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    responses.push(newResponse)
    setLocal(CONTACT_RESPONSES_KEY, responses)
    return newResponse
  },

  updateStatus: async (id: string, status: ContactStatus): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from('contact_responses')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error updating contact response status in Supabase:', err)
        throw err
      }
    }

    const responses = getLocal<ContactResponse>(CONTACT_RESPONSES_KEY)
    const index = responses.findIndex(r => r.id === id)
    if (index !== -1) {
      responses[index] = { 
        ...responses[index], 
        status, 
        updated_at: new Date().toISOString() 
      }
      setLocal(CONTACT_RESPONSES_KEY, responses)
    }
  },

  delete: async (id: string): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from('contact_responses')
          .delete()
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error deleting contact response from Supabase:', err)
        throw err
      }
    }

    const responses = getLocal<ContactResponse>(CONTACT_RESPONSES_KEY)
    const filtered = responses.filter(r => r.id !== id)
    setLocal(CONTACT_RESPONSES_KEY, filtered)
  },
}

// Form Submission Management
const FORM_SUBMISSIONS_KEY = 'msa_form_submissions'

export const FormSubmissionManager = {
  getAll: async (): Promise<FormSubmission[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('form_submissions')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((item: any) => ({
          id: item.id,
          form_id: item.form_id,
          answers: item.answers || {},
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }))
      } catch (err) {
        console.error('Error fetching form submissions from Supabase, falling back to local storage:', err)
      }
    }

    return getLocal<FormSubmission>(FORM_SUBMISSIONS_KEY)
  },

  add: async (submission: Omit<FormSubmission, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<FormSubmission> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('form_submissions')
          .insert([
            {
              form_id: submission.form_id,
              answers: submission.answers || {},
              status: 'pending',
            },
          ])
          .select()
          .single()

        if (error) throw error

        return {
          id: data.id,
          form_id: data.form_id,
          answers: data.answers || {},
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
        }
      } catch (err) {
        console.error('Error adding form submission to Supabase:', err)
        throw err
      }
    }

    const submissions = getLocal<FormSubmission>(FORM_SUBMISSIONS_KEY)
    const newSubmission: FormSubmission = {
      ...submission,
      id: Date.now().toString(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    submissions.push(newSubmission)
    setLocal(FORM_SUBMISSIONS_KEY, submissions)
    return newSubmission
  },

  updateStatus: async (id: string, status: ContactStatus): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from('form_submissions')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error updating form submission status in Supabase:', err)
        throw err
      }
    }

    const submissions = getLocal<FormSubmission>(FORM_SUBMISSIONS_KEY)
    const index = submissions.findIndex(s => s.id === id)
    if (index !== -1) {
      submissions[index] = { 
        ...submissions[index], 
        status, 
        updated_at: new Date().toISOString() 
      }
      setLocal(FORM_SUBMISSIONS_KEY, submissions)
    }
  },

  delete: async (id: string): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from('form_submissions')
          .delete()
          .eq('id', id)

        if (error) throw error
        return
      } catch (err) {
        console.error('Error deleting form submission from Supabase:', err)
        throw err
      }
    }

    const submissions = getLocal<FormSubmission>(FORM_SUBMISSIONS_KEY)
    const filtered = submissions.filter(s => s.id !== id)
    setLocal(FORM_SUBMISSIONS_KEY, filtered)
  },
}


