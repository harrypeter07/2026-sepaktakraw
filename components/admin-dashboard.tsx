'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TournamentCard } from '@/components/tournament-card'
import { TeamCard } from '@/components/team-card'
import { PlayerCard } from '@/components/player-card'
import { TournamentForm, TournamentFormData } from '@/components/tournament-form'
import { TeamForm, TeamFormData } from '@/components/team-form'
import { PlayerForm, PlayerFormData } from '@/components/player-form'
import { SiteSettingsManager } from '@/components/site-settings-manager'
import { ImageUpload } from '@/components/image-upload'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { 
  TournamentManager, 
  TeamManager, 
  PlayerManager, 
  FormSubmissionManager,
  Tournament, 
  Team, 
  Player 
} from '@/lib/data-manager'
import { SettingsManager } from '@/lib/site-settings'
import { FormField, FormSchema, FormSubmission } from '@/lib/types'
import { extractTextFromDocx, extractTextFromPdf, parseTextToFields } from '@/lib/form-parser-utils'
import { 
  Plus, Trash2, Edit2, UploadCloud, MoveUp, MoveDown, 
  PlusCircle, Send, Check, Eye, Archive, X, RefreshCw,
  Trophy, Users, User, FileText, MessageSquare, Settings, 
  Image, Menu, ShieldCheck, ChevronRight, Copy, LogOut, Loader2, Link2
} from 'lucide-react'

type AdminTab = 'tournaments' | 'teams' | 'players' | 'forms' | 'responses' | 'site' | 'media'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('tournaments')
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [schema, setSchema] = useState<FormSchema>({
    id: 'contact',
    title: 'Contact Form',
    fields: []
  })
  
  // Media Gallery state
  const [mediaFiles, setMediaFiles] = useState<{ url: string; name: string; folder: string }[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [uploadFolder, setUploadFolder] = useState('site')
  const [uploadedUrl, setUploadedUrl] = useState('')

  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth Context
  const { user, signOut } = useAuth()

  // Form state for Tournaments, Teams, Players
  const [showTournamentForm, setShowTournamentForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showPlayerForm, setShowPlayerForm] = useState(false)
  const [editingTournament, setEditingTournament] = useState<Tournament | undefined>()
  const [editingTeam, setEditingTeam] = useState<Team | undefined>()
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>()

  // Sidebar navigation configuration
  const navItems = [
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'players', label: 'Players', icon: User },
    { id: 'forms', label: 'Form Builder', icon: FileText },
    { id: 'responses', label: 'Form Responses', icon: MessageSquare },
    { id: 'site', label: 'Site Content', icon: Settings },
    { id: 'media', label: 'Media Gallery', icon: Image },
  ] as const

  // 1. Tab Selection from Search Params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      if (
        tabParam === 'teams' ||
        tabParam === 'players' ||
        tabParam === 'tournaments' ||
        tabParam === 'site' ||
        tabParam === 'forms' ||
        tabParam === 'responses' ||
        tabParam === 'media'
      ) {
        setActiveTab(tabParam as AdminTab)
      }
    }
  }, [])

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          tournamentsData, 
          teamsData, 
          playersData, 
          submissionsData,
          allSettings
        ] = await Promise.all([
          TournamentManager.getAll(),
          TeamManager.getAll(),
          PlayerManager.getAll(),
          FormSubmissionManager.getAll(),
          SettingsManager.getAll()
        ])
        
        setTournaments(tournamentsData)
        setTeams(teamsData)
        setPlayers(playersData)
        setSubmissions(submissionsData)

        const rawSchema = allSettings['site.custom_form_schema']?.text
        if (rawSchema) {
          try {
            const parsed = JSON.parse(rawSchema)
            if (parsed && parsed.fields) {
              setSchema(parsed)
            }
          } catch (e) {
            console.error('Error parsing site.custom_form_schema setting', e)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadData()
  }, [])

  // Load media files on demand when tab changes
  useEffect(() => {
    if (activeTab === 'media' && isLoaded) {
      loadMediaFiles()
    }
  }, [activeTab, isLoaded])

  // Gather files from Database records & Supabase Storage list APIs
  const loadMediaFiles = async () => {
    setLoadingMedia(true)
    try {
      const filesList: { url: string; name: string; folder: string }[] = []
      
      // 1. Scan current DB entities for referenced image URLs
      tournaments.forEach(t => {
        if (t.imageUrl && !filesList.some(f => f.url === t.imageUrl)) {
          filesList.push({ url: t.imageUrl, name: `${t.name} Banner`, folder: 'tournaments' })
        }
      })
      teams.forEach(t => {
        if (t.logoUrl && !filesList.some(f => f.url === t.logoUrl)) {
          filesList.push({ url: t.logoUrl, name: `${t.name} Logo`, folder: 'teams' })
        }
      })
      players.forEach(p => {
        if (p.photoUrl && !filesList.some(f => f.url === p.photoUrl)) {
          filesList.push({ url: p.photoUrl, name: p.name, folder: 'players' })
        }
      })
      
      // Settings values
      const allSettings = await SettingsManager.getAll()
      Object.entries(allSettings).forEach(([key, val]) => {
        if (val.url && !filesList.some(f => f.url === val.url)) {
          filesList.push({ url: val.url, name: key, folder: 'site' })
        }
      })
      
      // 2. Scan Supabase media bucket lists if enabled
      if (FEATURE_FLAGS.USE_SUPABASE) {
        try {
          const folders = ['site', 'tournaments', 'teams', 'players']
          for (const folder of folders) {
            const { data, error } = await supabase.storage
              .from('media')
              .list(folder)
            
            if (data && !error) {
              data.forEach(file => {
                const { data: urlData } = supabase.storage
                  .from('media')
                  .getPublicUrl(`${folder}/${file.name}`)
                
                if (urlData.publicUrl && !filesList.some(f => f.url === urlData.publicUrl)) {
                  filesList.push({
                    url: urlData.publicUrl,
                    name: file.name,
                    folder
                  })
                }
              })
            }
          }
        } catch (storageErr) {
          console.error('Error fetching files from storage list:', storageErr)
        }
      }

      setMediaFiles(filesList)
    } catch (err) {
      console.error('Error loading media files:', err)
    } finally {
      setLoadingMedia(false)
    }
  }

  // Copy media file link to clipboard
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopySuccess(url)
    setTimeout(() => setCopySuccess(null), 2000)
  }

  // Delete media file from Supabase storage or list
  const handleDeleteMedia = async (file: { url: string; name: string; folder: string }) => {
    if (confirm('Delete this file? Note: If this image is used in site settings, tournaments, or team logos, it will break references.')) {
      if (FEATURE_FLAGS.USE_SUPABASE) {
        try {
          // Extract filename from URL
          const parts = file.url.split('/')
          const filename = parts[parts.length - 1]
          const { error } = await supabase.storage
            .from('media')
            .remove([`${file.folder}/${filename}`])
          
          if (error) throw error
        } catch (err: any) {
          alert(`Failed to delete from bucket storage: ${err.message}`)
        }
      }
      setMediaFiles(prev => prev.filter(f => f.url !== file.url))
    }
  }

  // Tournament handlers
  const handleAddTournament = async (data: TournamentFormData) => {
    try {
      const newTournament = await TournamentManager.add({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        status: data.status as any,
        teamsCount: parseInt(data.teamsCount),
        imageUrl: data.imageUrl,
      })
      setTournaments([...tournaments, newTournament])
    } catch (err) {
      alert('Failed to add tournament')
    }
  }

  const handleTournamentSubmit = async (data: TournamentFormData) => {
    if (editingTournament) {
      try {
        await TournamentManager.update(editingTournament.id, {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          status: data.status as any,
          teamsCount: parseInt(data.teamsCount),
          imageUrl: data.imageUrl,
        })
        setTournaments(tournaments.map(t => t.id === editingTournament.id ? {
          ...t,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          status: data.status as any,
          teamsCount: parseInt(data.teamsCount),
          imageUrl: data.imageUrl,
        } : t))
      } catch (err) {
        alert('Failed to update tournament')
      }
    } else {
      await handleAddTournament(data)
    }
    setShowTournamentForm(false)
    setEditingTournament(undefined)
  }

  const handleDeleteTournament = async (id: string) => {
    if (confirm('Are you sure you want to delete this tournament?')) {
      try {
        await TournamentManager.delete(id)
        setTournaments(tournaments.filter(t => t.id !== id))
      } catch (err) {
        alert('Failed to delete tournament')
      }
    }
  }

  // Team handlers
  const handleAddTeam = async (data: TeamFormData) => {
    try {
      const newTeam = await TeamManager.add({
        name: data.name,
        location: data.location,
        coach: data.coach,
        playerCount: parseInt(data.playerCount) || 0,
        established: data.established,
        logoUrl: data.logoUrl,
      })
      setTeams([...teams, newTeam])
    } catch (err) {
      alert('Failed to add team')
    }
  }

  const handleTeamSubmit = async (data: TeamFormData) => {
    if (editingTeam) {
      try {
        await TeamManager.update(editingTeam.id, {
          name: data.name,
          location: data.location,
          coach: data.coach,
          established: data.established,
          logoUrl: data.logoUrl,
        })
        setTeams(teams.map(t => t.id === editingTeam.id ? {
          ...t,
          name: data.name,
          location: data.location,
          coach: data.coach,
          established: data.established,
          logoUrl: data.logoUrl,
        } : t))
      } catch (err) {
        alert('Failed to update team')
      }
    } else {
      await handleAddTeam(data)
    }
    setShowTeamForm(false)
    setEditingTeam(undefined)
  }

  const handleDeleteTeam = async (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await TeamManager.delete(id)
        setTeams(teams.filter(t => t.id !== id))
      } catch (err) {
        alert('Failed to delete team')
      }
    }
  }

  // Player handlers
  const handleAddPlayer = async (data: PlayerFormData) => {
    try {
      const newPlayer = await PlayerManager.add({
        name: data.name,
        position: data.position,
        team: data.team,
        jerseyNumber: parseInt(data.jerseyNumber),
        height: data.height,
        weight: data.weight,
        photoUrl: data.photoUrl,
      })
      setPlayers([...players, newPlayer])
    } catch (err) {
      alert('Failed to add player')
    }
  }

  const handlePlayerSubmit = async (data: PlayerFormData) => {
    if (editingPlayer) {
      try {
        await PlayerManager.update(editingPlayer.id, {
          name: data.name,
          position: data.position,
          team: data.team,
          jerseyNumber: parseInt(data.jerseyNumber),
          height: data.height,
          weight: data.weight,
          photoUrl: data.photoUrl,
        })
        setPlayers(players.map(p => p.id === editingPlayer.id ? {
          ...p,
          name: data.name,
          position: data.position,
          team: data.team,
          jerseyNumber: parseInt(data.jerseyNumber),
          height: data.height,
          weight: data.weight,
          photoUrl: data.photoUrl,
        } : p))
      } catch (err) {
        alert('Failed to update player')
      }
    } else {
      await handleAddPlayer(data)
    }
    setShowPlayerForm(false)
    setEditingPlayer(undefined)
  }

  const handleDeletePlayer = async (id: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        await PlayerManager.delete(id)
        setPlayers(players.filter(p => p.id !== id))
      } catch (err) {
        alert('Failed to delete player')
      }
    }
  }

  // Document Questionnaire Upload & Parse
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer
        let text = ''
        if (file.name.endsWith('.docx')) {
          text = await extractTextFromDocx(buffer)
        } else if (file.name.endsWith('.pdf')) {
          text = await extractTextFromPdf(buffer)
        } else {
          alert('Unsupported file type. Please upload a .docx or .pdf file.')
          setIsUploading(false)
          return
        }

        const fields = parseTextToFields(text)
        setSchema(prev => ({
          ...prev,
          fields
        }))
        alert(`Successfully extracted and parsed ${fields.length} fields from the questionnaire template!`)
      } catch (err: any) {
        alert(err.message || 'Error parsing document questionnaire.')
      } finally {
        setIsUploading(false)
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const handleFieldChange = (index: number, key: keyof FormField, value: any) => {
    setSchema(prev => {
      const fields = [...prev.fields]
      fields[index] = { ...fields[index], [key]: value }
      
      if (key === 'label') {
        const newId = value
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_+|_+$/g, '')
        fields[index].id = newId || fields[index].id
      }
      
      return { ...prev, fields }
    })
  }

  const handleAddField = () => {
    setSchema(prev => {
      const newField: FormField = {
        id: `field_${Date.now()}`,
        label: 'New Question',
        type: 'text',
        required: false,
        placeholder: 'Enter answer here'
      }
      return { ...prev, fields: [...prev.fields, newField] }
    })
  }

  const handleDeleteField = (index: number) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    setSchema(prev => {
      const fields = [...prev.fields]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= fields.length) return prev

      const temp = fields[index]
      fields[index] = fields[targetIndex]
      fields[targetIndex] = temp

      return { ...prev, fields }
    })
  }

  const handlePublishForm = async () => {
    setPublishSuccess(false)
    try {
      await SettingsManager.set('site.custom_form_schema', { text: JSON.stringify(schema) })
      setPublishSuccess(true)
      setTimeout(() => setPublishSuccess(false), 3000)
    } catch (err: any) {
      alert(err.message || 'Failed to publish form schema')
    }
  }

  // Submission Viewer Handlers
  const handleUpdateSubmissionStatus = async (id: string, status: any) => {
    try {
      await FormSubmissionManager.updateStatus(id, status)
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status } : s))
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleDeleteSubmission = async (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      try {
        await FormSubmissionManager.delete(id)
        setSubmissions(submissions.filter(s => s.id !== id))
      } catch (err) {
        alert('Failed to delete submission')
      }
    }
  }

  const handleRefreshSubmissions = async () => {
    try {
      const data = await FormSubmissionManager.getAll()
      setSubmissions(data)
    } catch (err) {
      alert('Failed to refresh submissions')
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-500">Loading admin console...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans antialiased">
      
      {/* Sidebar navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col h-full bg-slate-900 text-slate-100 w-64 border-r border-slate-800 transition-all duration-300 transform md:relative md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-base leading-none">MSA Panel</h2>
              <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase mt-1 block">Management Panel</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={12} className={isActive ? 'text-blue-300' : 'text-slate-600'} />
              </button>
            )
          })}
        </nav>

        {/* Profile and Logout Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 space-y-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate text-slate-100">{user?.email?.split('@')[0] || 'Administrator'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@msa.org.in'}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-red-950/30 hover:text-red-400 text-sm font-bold rounded-lg text-slate-300 hover:bg-slate-700 transition"
          >
            <LogOut size={16} /> 
            Logout Panel
          </button>
        </div>
      </aside>

      {/* Main Workspace Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Workspace Topbar header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 hover:bg-slate-100 rounded-md text-slate-600 border shrink-0"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-bold text-slate-800 text-lg sm:text-xl capitalize">
              {activeTab === 'site' 
                ? 'Site Settings copy & layout' 
                : activeTab === 'forms' 
                ? 'Form Builder Template Parser' 
                : activeTab === 'responses' 
                ? 'Dynamic Form Responses' 
                : activeTab === 'media'
                ? 'Media Management Hub'
                : activeTab
              }
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition"
            >
              <Link2 size={14} />
              View Public Website
            </Link>
          </div>
        </header>

        {/* Scrollable Work View */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
          
          {/* TOURNAMENTS SECTION */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Manage Tournaments</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Create, update, and manage tournaments of Maharashtra Sepaktakraw Association.</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingTournament(undefined)
                    setShowTournamentForm(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Tournament
                </Button>
              </div>

              {tournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tournaments.map(tournament => (
                    <div key={tournament.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                      <TournamentCard {...tournament} />
                      <div className="border-t p-4 flex gap-2 bg-slate-50">
                        <Button
                          onClick={() => {
                            setEditingTournament(tournament)
                            setShowTournamentForm(true)
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1.5 h-9"
                        >
                          <Edit2 size={14} /> Edit details
                        </Button>
                        <Button
                          onClick={() => handleDeleteTournament(tournament.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1.5 h-9"
                        >
                          <Trash2 size={14} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border bg-white rounded-xl text-slate-400">
                  <Trophy className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-500">No Tournaments Registered</p>
                  <p className="text-xs mt-1">Click "Add Tournament" to register a tournament.</p>
                </div>
              )}
            </div>
          )}

          {/* TEAMS SECTION */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Manage Teams</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Register, update, and manage official MSA Sepaktakraw teams.</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingTeam(undefined)
                    setShowTeamForm(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Team
                </Button>
              </div>

              {teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map(team => (
                    <div key={team.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                      <TeamCard {...team} />
                      <div className="border-t p-4 flex gap-2 bg-slate-50">
                        <Button
                          onClick={() => {
                            setEditingTeam(team)
                            setShowTeamForm(true)
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1.5 h-9"
                        >
                          <Edit2 size={14} /> Edit details
                        </Button>
                        <Button
                          onClick={() => handleDeleteTeam(team.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1.5 h-9"
                        >
                          <Trash2 size={14} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border bg-white rounded-xl text-slate-400">
                  <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-500">No Teams Registered</p>
                  <p className="text-xs mt-1">Click "Add Team" to register a team.</p>
                </div>
              )}
            </div>
          )}

          {/* PLAYERS SECTION */}
          {activeTab === 'players' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Manage Players</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Register, update, and track player profiles and details.</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingPlayer(undefined)
                    setShowPlayerForm(true)
                  }}
                  disabled={teams.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Player
                </Button>
              </div>

              {teams.length === 0 && (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm font-semibold flex items-center gap-2">
                  <X size={16} />
                  Create at least one team first before registering players.
                </div>
              )}

              {players.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {players.map(player => (
                    <div key={player.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                      <PlayerCard {...player} />
                      <div className="border-t p-4 flex gap-2 bg-slate-50">
                        <Button
                          onClick={() => {
                            setEditingPlayer(player)
                            setShowPlayerForm(true)
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1.5 h-9"
                        >
                          <Edit2 size={14} /> Edit profile
                        </Button>
                        <Button
                          onClick={() => handleDeletePlayer(player.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1.5 h-9"
                        >
                          <Trash2 size={14} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border bg-white rounded-xl text-slate-400">
                  <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-500">No Players Registered Yet</p>
                  <p className="text-xs mt-1">Click "Add Player" to register a player.</p>
                </div>
              )}
            </div>
          )}

          {/* FORM BUILDER SECTION */}
          {activeTab === 'forms' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Dynamic Form Builder</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Parse dynamic questionnaires from a Word (.docx) or PDF template to generate public forms.</p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white rounded-xl p-8 text-center transition cursor-pointer relative shadow-sm">
                <input
                  type="file"
                  accept=".docx,.pdf"
                  onChange={handleDocumentUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <UploadCloud size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      {isUploading ? 'Extracting text & form fields...' : 'Upload Word (.docx) or PDF Form Template'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Drag and drop your questionnaire document here to auto-populate fields
                    </p>
                  </div>
                </div>
              </div>

              {/* Fields List */}
              <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b pb-5">
                  <div className="flex-1 w-full max-w-md">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Public Form Title</label>
                    <input
                      type="text"
                      value={schema.title}
                      onChange={(e) => setSchema(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus-visible:outline-none"
                      placeholder="e.g., Contact Form / Registration Form"
                    />
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      onClick={handleAddField}
                      variant="outline"
                      className="flex items-center gap-1.5 h-10 w-full sm:w-auto font-semibold"
                    >
                      <PlusCircle size={16} /> Add Field
                    </Button>
                    <Button
                      onClick={handlePublishForm}
                      disabled={schema.fields.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 h-10 w-full sm:w-auto"
                    >
                      {publishSuccess ? <Check size={16} /> : <Send size={16} />}
                      {publishSuccess ? 'Published!' : 'Publish Form'}
                    </Button>
                  </div>
                </div>

                {schema.fields.length === 0 ? (
                  <div className="py-16 text-center border border-dashed rounded-xl text-slate-400 bg-slate-50/20">
                    <p className="font-semibold text-slate-500">No Form Fields Configured</p>
                    <p className="text-xs mt-1 max-w-sm mx-auto">
                      Your dynamic form has no fields. Upload a template above or click "Add Field" to start building.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schema.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex flex-col lg:flex-row gap-4 p-5 rounded-xl border border-slate-100 bg-slate-50/30 hover:border-slate-200 transition items-start lg:items-center"
                      >
                        {/* Label */}
                        <div className="flex-1 w-full">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Label</label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus-visible:outline-none"
                            placeholder="e.g. Enter Label/Question Description"
                          />
                        </div>

                        {/* Input Type */}
                        <div className="w-full lg:w-40">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Type</label>
                          <select
                            value={field.type}
                            onChange={(e) => handleFieldChange(index, 'type', e.target.value as any)}
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus-visible:outline-none"
                          >
                            <option value="text">Short Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="textarea">Paragraph Text</option>
                            <option value="select">Dropdown Options</option>
                          </select>
                        </div>

                        {/* Options */}
                        {field.type === 'select' && (
                          <div className="flex-1 w-full">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dropdown Options (Comma separated)</label>
                            <input
                              type="text"
                              value={field.options?.join(', ') || ''}
                              onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus-visible:outline-none"
                              placeholder="e.g. Option 1, Option 2"
                            />
                          </div>
                        )}

                        {/* Required toggle */}
                        <div className="flex items-center gap-2 pt-2 lg:pt-5 self-start lg:self-center">
                          <input
                            type="checkbox"
                            id={`req-${field.id}`}
                            checked={field.required}
                            onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`req-${field.id}`} className="text-sm font-semibold text-slate-700 select-none">
                            Required
                          </label>
                        </div>

                        {/* Move Actions */}
                        <div className="flex gap-1.5 self-end lg:self-center pt-2 lg:pt-5">
                          <button
                            onClick={() => handleMoveField(index, 'up')}
                            disabled={index === 0}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-30 transition"
                            title="Move Up"
                          >
                            <MoveUp size={16} />
                          </button>
                          <button
                            onClick={() => handleMoveField(index, 'down')}
                            disabled={index === schema.fields.length - 1}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-30 transition"
                            title="Move Down"
                          >
                            <MoveDown size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteField(index)}
                            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md transition"
                            title="Delete Field"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBMISSIONS LIST */}
          {activeTab === 'responses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Form Submissions</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Review responses submitted dynamically by public users.</p>
                </div>
                <Button
                  onClick={handleRefreshSubmissions}
                  variant="outline"
                  className="flex items-center gap-1.5 font-semibold"
                >
                  <RefreshCw size={16} /> Refresh
                </Button>
              </div>

              {submissions.length === 0 ? (
                <div className="py-16 text-center border rounded-xl bg-white text-slate-400">
                  <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-500">No Submissions Found</p>
                  <p className="text-xs mt-1">Submissions submitted via the public contact form will appear here.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b text-slate-500 text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Submitted At</th>
                          <th className="px-6 py-4">Status</th>
                          {schema.fields.slice(0, 3).map(field => (
                            <th key={field.id} className="px-6 py-4">{field.label}</th>
                          ))}
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {submissions.map((submission) => {
                          const dateStr = new Date(submission.created_at).toLocaleString()
                          const statusColors = {
                            pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
                            read: 'bg-blue-50 text-blue-700 border border-blue-200',
                            archived: 'bg-slate-50 text-slate-600 border border-slate-200'
                          }

                          return (
                            <tr key={submission.id} className="hover:bg-slate-50/50 transition">
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{dateStr}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[submission.status]}`}>
                                  {submission.status}
                                </span>
                              </td>
                              {schema.fields.slice(0, 3).map(field => {
                                const answer = submission.answers[field.id]
                                const displayedVal = Array.isArray(answer)
                                  ? answer.join(', ')
                                  : typeof answer === 'object' && answer !== null
                                  ? JSON.stringify(answer)
                                  : answer?.toString() || '-'
                                
                                return (
                                  <td key={field.id} className="px-6 py-4 max-w-xs truncate text-slate-600 font-medium">
                                    {displayedVal}
                                  </td>
                                )
                              })}
                              <td className="px-6 py-4 whitespace-nowrap text-right text-slate-500">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedSubmission(submission)}
                                    className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-md transition"
                                    title="View Details"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateSubmissionStatus(submission.id, submission.status === 'read' ? 'archived' : 'read')}
                                    className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-md transition"
                                    title={submission.status === 'read' ? 'Archive' : 'Mark as Read'}
                                  >
                                    <Archive size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubmission(submission.id)}
                                    className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-md transition"
                                    title="Delete Submission"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SITE SETTINGS Tab */}
          {activeTab === 'site' && (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <SiteSettingsManager />
            </div>
          )}

          {/* MEDIA GALLERY Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Media Gallery</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Upload new images and manage existing images used across settings, tournaments, teams, and players.</p>
              </div>

              {/* Upload image widget */}
              <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Upload New Image Asset</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Folder Category</label>
                    <select
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus-visible:outline-none"
                    >
                      <option value="site">site (Global background / icons)</option>
                      <option value="tournaments">tournaments (Banners)</option>
                      <option value="teams">teams (Club Logos)</option>
                      <option value="players">players (Profile photos)</option>
                    </select>
                  </div>
                  <div>
                    <ImageUpload
                      folder={uploadFolder}
                      shape={uploadFolder === 'tournaments' ? 'banner' : 'avatar'}
                      label="Select File"
                      value={uploadedUrl}
                      onChange={(url) => {
                        setUploadedUrl(url)
                        if (url) {
                          alert(`Image uploaded successfully! Public URL copied to clipboard automatically.`)
                          navigator.clipboard.writeText(url)
                          loadMediaFiles()
                        }
                      }}
                    />
                  </div>
                </div>

                {uploadedUrl && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-500 uppercase">Uploaded Image URL</p>
                      <p className="text-xs font-mono text-slate-600 truncate mt-1 bg-white p-2 border rounded select-all">{uploadedUrl}</p>
                    </div>
                    <Button
                      onClick={() => handleCopyLink(uploadedUrl)}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex gap-1.5 h-10"
                    >
                      <Copy size={16} /> Copy URL
                    </Button>
                  </div>
                )}
              </div>

              {/* Media gallery grid */}
              {loadingMedia ? (
                <div className="py-12 text-center text-slate-400">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-3" />
                  <p className="text-sm font-semibold">Loading media assets...</p>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="py-16 text-center border rounded-xl bg-white text-slate-400">
                  <Image className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-500">No Image Assets Found</p>
                  <p className="text-xs mt-1">Upload a file or register tournaments/teams/players to see images here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {mediaFiles.map((file, idx) => (
                    <div key={idx} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      {/* Image Preview box */}
                      <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden border-b">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 text-white px-2 py-0.5 rounded shadow">
                          {file.folder}
                        </span>
                      </div>

                      {/* Info & Copy actions */}
                      <div className="p-3.5 space-y-3 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopyLink(file.url)}
                            className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-slate-100 border text-slate-700 text-xs font-semibold py-1.5 rounded-lg transition"
                          >
                            {copySuccess === file.url ? (
                              <>
                                <Check size={12} className="text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(file)}
                            className="p-1.5 bg-white hover:bg-red-50 hover:text-red-600 text-slate-400 border hover:border-red-200 rounded-lg transition"
                            title="Delete Asset"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Submissions Detail Overlay Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border shadow-xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Submission Details</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Received {new Date(selectedSubmission.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submission ID</p>
                  <p className="font-mono text-xs text-slate-700 mt-1 select-all">{selectedSubmission.id}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Response Status</p>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => {
                      handleUpdateSubmissionStatus(selectedSubmission.id, e.target.value as any)
                      setSelectedSubmission(prev => prev ? { ...prev, status: e.target.value as any } : null)
                    }}
                    className="mt-1 flex h-8 w-full rounded-md border border-input bg-white px-2 py-0.5 text-xs shadow-sm focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 border-b pb-1">Dynamic Fields Answers</h4>
                <div className="space-y-4">
                  {schema.fields.map(field => {
                    const answer = selectedSubmission.answers[field.id]
                    return (
                      <div key={field.id} className="space-y-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{field.label}</p>
                        <div className="p-3.5 rounded-lg border bg-slate-50/50 text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                          {answer?.toString() || <span className="text-slate-400 italic">No response submitted</span>}
                        </div>
                      </div>
                    )
                  })}
                  {Object.keys(selectedSubmission.answers)
                    .filter(key => !schema.fields.some(f => f.id === key))
                    .map(key => (
                      <div key={key} className="space-y-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{key} <span className="text-xs font-normal text-muted-foreground lowercase italic">(legacy field)</span></p>
                        <div className="p-3.5 rounded-lg border bg-slate-50/50 text-slate-600 text-sm whitespace-pre-wrap">
                          {selectedSubmission.answers[key]?.toString() || <span className="text-slate-400 italic">No response submitted</span>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
              <Button
                onClick={() => {
                  if (confirm('Delete this response?')) {
                    handleDeleteSubmission(selectedSubmission.id)
                    setSelectedSubmission(null)
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Delete Submission
              </Button>
              <Button
                onClick={() => setSelectedSubmission(null)}
                variant="outline"
                className="font-medium"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD modals for Tournaments, Teams, Players */}
      {showTournamentForm && (
        <TournamentForm
          onClose={() => {
            setShowTournamentForm(false)
            setEditingTournament(undefined)
          }}
          onSubmit={handleTournamentSubmit}
          initialData={editingTournament ? {
            name: editingTournament.name,
            startDate: editingTournament.startDate,
            endDate: editingTournament.endDate,
            location: editingTournament.location,
            status: editingTournament.status,
            teamsCount: editingTournament.teamsCount.toString(),
            imageUrl: editingTournament.imageUrl || '',
          } : undefined}
        />
      )}

      {showTeamForm && (
        <TeamForm
          onClose={() => {
            setShowTeamForm(false)
            setEditingTeam(undefined)
          }}
          onSubmit={handleTeamSubmit}
          initialData={editingTeam ? {
            name: editingTeam.name,
            location: editingTeam.location,
            coach: editingTeam.coach,
            playerCount: editingTeam.playerCount.toString(),
            established: editingTeam.established,
            logoUrl: editingTeam.logoUrl || '',
          } : undefined}
        />
      )}

      {showPlayerForm && (
        <PlayerForm
          onClose={() => {
            setShowPlayerForm(false)
            setEditingPlayer(undefined)
          }}
          onSubmit={handlePlayerSubmit}
          teams={teams.map(t => t.name)}
          initialData={editingPlayer ? {
            name: editingPlayer.name,
            position: editingPlayer.position,
            team: editingPlayer.team,
            jerseyNumber: editingPlayer.jerseyNumber.toString(),
            height: editingPlayer.height,
            weight: editingPlayer.weight,
            photoUrl: editingPlayer.photoUrl,
          } : undefined}
        />
      )}
    </div>
  )
}
