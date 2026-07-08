'use client'

import { useState, useEffect } from 'react'
import { TournamentManager, TeamManager, PlayerManager } from '@/lib/data-manager'
import { SettingsManager } from '@/lib/site-settings'
import { ImageUpload } from '@/components/image-upload'
import { supabase } from '@/lib/supabase'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { Button } from '@/components/ui/button'
import { 
  Image as ImageIcon, Loader2, Copy, Trash2, Check, UploadCloud, RefreshCw 
} from 'lucide-react'

export default function MediaGalleryAdminPage() {
  const [mediaFiles, setMediaFiles] = useState<{ url: string; name: string; folder: string }[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [uploadFolder, setUploadFolder] = useState('site')
  const [uploadedUrl, setUploadedUrl] = useState('')

  const loadMediaFiles = async () => {
    setLoadingMedia(true)
    try {
      const filesList: { url: string; name: string; folder: string }[] = []
      
      // 1. Scan current entities in local storage / DB
      const [tournaments, teams, players, allSettings] = await Promise.all([
        TournamentManager.getAll(),
        TeamManager.getAll(),
        PlayerManager.getAll(),
        SettingsManager.getAll()
      ])

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
          console.error('Error listing Supabase media folders:', storageErr)
        }
      }

      setMediaFiles(filesList)
    } catch (err) {
      console.error('Error loading media files:', err)
    } finally {
      setLoadingMedia(false)
    }
  }

  useEffect(() => {
    loadMediaFiles()
  }, [])

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopySuccess(url)
    setTimeout(() => setCopySuccess(null), 2000)
  }

  const handleDelete = async (file: { url: string; name: string; folder: string }) => {
    if (confirm('Delete this file? Note: If this image is used in site settings, tournaments, or team logos, it will break references.')) {
      if (FEATURE_FLAGS.USE_SUPABASE) {
        try {
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Topbar Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div>
          <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Media Management Hub</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadMediaFiles}
            variant="outline"
            className="flex items-center gap-1.5 font-semibold h-9 text-xs"
          >
            <RefreshCw size={14} className="h-3.5 w-3.5" /> Refresh Assets
          </Button>
        </div>
      </header>

      {/* Main content pane */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 space-y-6">
        
        {/* Upload Widget */}
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4 max-w-5xl mx-auto">
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
                className="bg-blue-600 hover:bg-blue-700 text-white flex gap-1.5 h-10 font-semibold text-xs"
              >
                <Copy size={14} /> Copy URL
              </Button>
            </div>
          )}
        </div>

        {/* Media gallery grid */}
        <div className="max-w-5xl mx-auto">
          {loadingMedia ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-3" />
              <p className="text-sm font-semibold">Loading media assets...</p>
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="py-16 text-center border rounded-xl bg-white text-slate-400">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="font-semibold text-slate-500">No Image Assets Found</p>
              <p className="text-xs mt-1">Upload a file or register tournaments/teams/players to see images here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {mediaFiles.map((file, idx) => (
                <div key={idx} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  {/* Image Preview */}
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

                  {/* Copy actions */}
                  <div className="p-3 bg-slate-50/50 space-y-2.5">
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
                        onClick={() => handleDelete(file)}
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

      </div>
    </div>
  )
}
