import { FEATURE_FLAGS } from './feature-flags'
import { supabase } from './supabase'

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

// Helper for localStorage fallback
const getLocal = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(key)
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
