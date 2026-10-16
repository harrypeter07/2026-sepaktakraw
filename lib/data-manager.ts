import { FEATURE_FLAGS } from './feature-flags'
import { supabase } from './supabase'
import { ContactResponse, ContactStatus, FormSubmission } from './types'
import {
  INITIAL_TEAMS,
  INITIAL_PLAYERS,
  INITIAL_TOURNAMENTS,
  INITIAL_MATCHES,
  INITIAL_ARTICLES,
  MatchItem,
  MatchSetItem,
} from './initial-data'

export type { MatchItem, MatchSetItem }

// Types
export type TournamentFormat = 'league' | 'knockout' | 'group_stage'

export interface Tournament {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  status: 'upcoming' | 'ongoing' | 'completed'
  teamsCount: number
  imageUrl?: string
  description?: string
  organizer?: string
  prizePool?: number
  format?: TournamentFormat
}

export interface Team {
  id: string
  name: string
  location: string
  coach: string
  playerCount: number
  established: string
  logoUrl?: string
  districtId?: string
}

export type ArticleCategory = 'news' | 'tournament' | 'team' | 'player' | 'other'

export interface Article {
  id: string
  title: string
  content: string
  category: ArticleCategory
  imageUrl?: string
  isPublished: boolean
  publishedAt?: string | null
  createdAt: string
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
const ARTICLES_KEY = 'msa_articles'
const MATCHES_KEY = 'msa_matches'

const getInitialDefault = <T>(key: string): T[] => {
  if (key === TOURNAMENTS_KEY) return INITIAL_TOURNAMENTS as unknown as T[]
  if (key === TEAMS_KEY) return INITIAL_TEAMS as unknown as T[]
  if (key === PLAYERS_KEY) return INITIAL_PLAYERS as unknown as T[]
  if (key === ARTICLES_KEY) return INITIAL_ARTICLES as unknown as T[]
  if (key === MATCHES_KEY) return INITIAL_MATCHES as unknown as T[]
  return []
}

// Helper for localStorage fallback with initial data seeding
const getLocal = <T>(key: string): T[] => {
  const initial = getInitialDefault<T>(key)
  if (typeof window === 'undefined') return initial
  const data = localStorage.getItem(key)
  if (!data) {
    if (initial.length > 0) {
      try {
        localStorage.setItem(key, JSON.stringify(initial))
      } catch (e) {
        // Ignore quota/private mode errors
      }
    }
    return initial
  }
  try {
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return initial.length > 0 ? initial : []
  } catch {
    return initial
  }
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
          description: item.description || '',
          organizer: item.organizer || '',
          prizePool: item.total_prize_pool ?? undefined,
          format: item.format || 'league',
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
              format: tournament.format || 'league',
              description: tournament.description || null,
              organizer: tournament.organizer || null,
              total_prize_pool: tournament.prizePool ?? null,
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
          description: data.description || '',
          organizer: data.organizer || '',
          prizePool: data.total_prize_pool ?? undefined,
          format: data.format || 'league',
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
        if (updates.description !== undefined) mappedUpdates.description = updates.description || null
        if (updates.organizer !== undefined) mappedUpdates.organizer = updates.organizer || null
        if (updates.prizePool !== undefined) mappedUpdates.total_prize_pool = updates.prizePool ?? null
        if (updates.format !== undefined) mappedUpdates.format = updates.format

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
          districtId: item.district_id || item.districtId,
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

// News / Article Management (backed by the `articles` table)

const mapArticleRow = (item: any): Article => ({
  id: item.id,
  title: item.title,
  content: item.content,
  category: item.category || 'news',
  imageUrl: item.featured_image_url || '',
  isPublished: !!item.is_published,
  publishedAt: item.published_at,
  createdAt: item.created_at,
})

export const ArticleManager = {
  // All articles (admin view).
  getAll: async (): Promise<Article[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return (data || []).map(mapArticleRow)
      } catch (err) {
        console.error('Error fetching articles from Supabase, falling back to local storage:', err)
      }
    }
    return getLocal<Article>(ARTICLES_KEY)
  },

  // Only published articles, newest first (public view).
  getPublished: async (): Promise<Article[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false, nullsFirst: false })

        if (error) throw error
        return (data || []).map(mapArticleRow)
      } catch (err) {
        console.error('Error fetching published articles from Supabase, falling back to local storage:', err)
      }
    }
    return getLocal<Article>(ARTICLES_KEY).filter(a => a.isPublished)
  },

  add: async (article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthenticated')

        const { data, error } = await supabase
          .from('articles')
          .insert([
            {
              title: article.title,
              content: article.content,
              category: article.category,
              featured_image_url: article.imageUrl || null,
              is_published: article.isPublished,
              published_at: article.isPublished
                ? article.publishedAt || new Date().toISOString()
                : null,
              author_id: user.id,
            },
          ])
          .select()
          .single()

        if (error) throw error
        return mapArticleRow(data)
      } catch (err) {
        console.error('Error adding article to Supabase:', err)
        throw err
      }
    }

    const articles = getLocal<Article>(ARTICLES_KEY)
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      publishedAt: article.isPublished ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
    }
    articles.unshift(newArticle)
    setLocal(ARTICLES_KEY, articles)
    return newArticle
  },

  update: async (id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const mapped: any = {}
        if (updates.title !== undefined) mapped.title = updates.title
        if (updates.content !== undefined) mapped.content = updates.content
        if (updates.category !== undefined) mapped.category = updates.category
        if (updates.imageUrl !== undefined) mapped.featured_image_url = updates.imageUrl || null
        if (updates.isPublished !== undefined) {
          mapped.is_published = updates.isPublished
          // Stamp a publish date the first time it goes live.
          mapped.published_at = updates.isPublished
            ? updates.publishedAt || new Date().toISOString()
            : null
        }
        mapped.updated_at = new Date().toISOString()

        const { error } = await supabase.from('articles').update(mapped).eq('id', id)
        if (error) throw error
        return
      } catch (err) {
        console.error('Error updating article in Supabase:', err)
        throw err
      }
    }

    const articles = getLocal<Article>(ARTICLES_KEY)
    const index = articles.findIndex(a => a.id === id)
    if (index !== -1) {
      const next = { ...articles[index], ...updates }
      if (updates.isPublished !== undefined) {
        next.publishedAt = updates.isPublished
          ? articles[index].publishedAt || new Date().toISOString()
          : null
      }
      articles[index] = next
      setLocal(ARTICLES_KEY, articles)
    }
  },

  delete: async (id: string): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase.from('articles').delete().eq('id', id)
        if (error) throw error
        return
      } catch (err) {
        console.error('Error deleting article from Supabase:', err)
        throw err
      }
    }

    const articles = getLocal<Article>(ARTICLES_KEY)
    setLocal(ARTICLES_KEY, articles.filter(a => a.id !== id))
  },
}

// Shared helpers for rendering articles on public pages.
export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  news: 'News',
  tournament: 'Tournament',
  team: 'Team',
  player: 'Player',
  other: 'Update',
}

export const articleExcerpt = (content: string, max = 160): string => {
  const clean = content.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean
}

export const articleReadTime = (content: string): string => {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

export const articleDate = (article: Article): string => {
  const iso = article.publishedAt || article.createdAt
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Match Management
export const MatchManager = {
  getAll: async (): Promise<MatchItem[]> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*, match_sets(*)')
          .order('match_date', { ascending: false })

        if (error) throw error
        return (data || []).map((m: any) => ({
          id: m.id,
          tournament_id: m.tournament_id,
          home_team_id: m.home_team_id,
          away_team_id: m.away_team_id,
          venue: m.venue || '',
          match_date: m.match_date,
          status: m.status,
          home_score: m.home_score || 0,
          away_score: m.away_score || 0,
          duration_minutes: m.duration_minutes,
          sets: (m.match_sets || []).map((s: any) => ({
            set_number: s.set_number,
            home_points: s.home_points,
            away_points: s.away_points,
          })),
        }))
      } catch (err) {
        console.error('Error fetching matches from Supabase, falling back to local storage:', err)
      }
    }
    return getLocal<MatchItem>(MATCHES_KEY)
  },

  getByTournament: async (tournamentId: string): Promise<MatchItem[]> => {
    const all = await MatchManager.getAll()
    return all.filter(m => m.tournament_id === tournamentId)
  },

  add: async (match: Omit<MatchItem, 'id'>): Promise<MatchItem> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from('matches')
          .insert([
            {
              tournament_id: match.tournament_id,
              home_team_id: match.home_team_id,
              away_team_id: match.away_team_id,
              venue: match.venue,
              match_date: match.match_date,
              status: match.status,
              home_score: match.home_score,
              away_score: match.away_score,
              duration_minutes: match.duration_minutes || null,
            },
          ])
          .select()
          .single()

        if (error) throw error
        return {
          id: data.id,
          ...match,
        }
      } catch (err) {
        console.error('Error adding match to Supabase:', err)
        throw err
      }
    }

    const matches = getLocal<MatchItem>(MATCHES_KEY)
    const newMatch: MatchItem = {
      ...match,
      id: `match-${Date.now()}`,
    }
    matches.unshift(newMatch)
    setLocal(MATCHES_KEY, matches)
    return newMatch
  },

  update: async (id: string, updates: Partial<MatchItem>): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const mapped: any = {}
        if (updates.status !== undefined) mapped.status = updates.status
        if (updates.home_score !== undefined) mapped.home_score = updates.home_score
        if (updates.away_score !== undefined) mapped.away_score = updates.away_score
        if (updates.venue !== undefined) mapped.venue = updates.venue
        if (updates.match_date !== undefined) mapped.match_date = updates.match_date

        const { error } = await supabase.from('matches').update(mapped).eq('id', id)
        if (error) throw error
        return
      } catch (err) {
        console.error('Error updating match in Supabase:', err)
        throw err
      }
    }

    const matches = getLocal<MatchItem>(MATCHES_KEY)
    const index = matches.findIndex(m => m.id === id)
    if (index !== -1) {
      matches[index] = { ...matches[index], ...updates }
      setLocal(MATCHES_KEY, matches)
    }
  },

  delete: async (id: string): Promise<void> => {
    if (FEATURE_FLAGS.USE_SUPABASE) {
      try {
        const { error } = await supabase.from('matches').delete().eq('id', id)
        if (error) throw error
        return
      } catch (err) {
        console.error('Error deleting match from Supabase:', err)
        throw err
      }
    }

    const matches = getLocal<MatchItem>(MATCHES_KEY)
    setLocal(MATCHES_KEY, matches.filter(m => m.id !== id))
  },
}



