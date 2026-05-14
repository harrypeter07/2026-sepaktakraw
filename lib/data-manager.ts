// Types
export interface Tournament {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  status: 'upcoming' | 'ongoing' | 'completed'
  teamsCount: number
}

export interface Team {
  id: string
  name: string
  location: string
  coach: string
  playerCount: number
  established: string
}

export interface Player {
  id: string
  name: string
  position: string
  team: string
  jerseyNumber: number
  height?: string
  weight?: string
}

// LocalStorage Keys
const TOURNAMENTS_KEY = 'msa_tournaments'
const TEAMS_KEY = 'msa_teams'
const PLAYERS_KEY = 'msa_players'

// Tournament Management
export const TournamentManager = {
  getAll: (): Tournament[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(TOURNAMENTS_KEY)
    return data ? JSON.parse(data) : []
  },

  add: (tournament: Omit<Tournament, 'id'>): Tournament => {
    const tournaments = TournamentManager.getAll()
    const newTournament: Tournament = {
      ...tournament,
      id: Date.now().toString(),
    }
    tournaments.push(newTournament)
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments))
    }
    return newTournament
  },

  update: (id: string, updates: Partial<Tournament>): void => {
    const tournaments = TournamentManager.getAll()
    const index = tournaments.findIndex(t => t.id === id)
    if (index !== -1) {
      tournaments[index] = { ...tournaments[index], ...updates }
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments))
      }
    }
  },

  delete: (id: string): void => {
    const tournaments = TournamentManager.getAll()
    const filtered = tournaments.filter(t => t.id !== id)
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(filtered))
    }
  },
}

// Team Management
export const TeamManager = {
  getAll: (): Team[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(TEAMS_KEY)
    return data ? JSON.parse(data) : []
  },

  add: (team: Omit<Team, 'id'>): Team => {
    const teams = TeamManager.getAll()
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
    }
    teams.push(newTeam)
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(teams))
    }
    return newTeam
  },

  update: (id: string, updates: Partial<Team>): void => {
    const teams = TeamManager.getAll()
    const index = teams.findIndex(t => t.id === id)
    if (index !== -1) {
      teams[index] = { ...teams[index], ...updates }
      if (typeof window !== 'undefined') {
        localStorage.setItem(TEAMS_KEY, JSON.stringify(teams))
      }
    }
  },

  delete: (id: string): void => {
    const teams = TeamManager.getAll()
    const filtered = teams.filter(t => t.id !== id)
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(filtered))
    }
  },
}

// Player Management
export const PlayerManager = {
  getAll: (): Player[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(PLAYERS_KEY)
    return data ? JSON.parse(data) : []
  },

  add: (player: Omit<Player, 'id'>): Player => {
    const players = PlayerManager.getAll()
    const newPlayer: Player = {
      ...player,
      id: Date.now().toString(),
    }
    players.push(newPlayer)
    if (typeof window !== 'undefined') {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
    }
    return newPlayer
  },

  update: (id: string, updates: Partial<Player>): void => {
    const players = PlayerManager.getAll()
    const index = players.findIndex(p => p.id === id)
    if (index !== -1) {
      players[index] = { ...players[index], ...updates }
      if (typeof window !== 'undefined') {
        localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
      }
    }
  },

  delete: (id: string): void => {
    const players = PlayerManager.getAll()
    const filtered = players.filter(p => p.id !== id)
    if (typeof window !== 'undefined') {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(filtered))
    }
  },

  getByTeam: (team: string): Player[] => {
    return PlayerManager.getAll().filter(p => p.team === team)
  },
}
