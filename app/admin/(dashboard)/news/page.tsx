'use client'

import { useState, useEffect } from 'react'
import { ArticleManager, Article, ArticleCategory, articleDate } from '@/lib/data-manager'
import { ImageUpload } from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import {
  Plus, Pencil, Trash2, X, Loader2, Newspaper, Eye, EyeOff, Check,
} from 'lucide-react'

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'news', label: 'News' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'team', label: 'Team' },
  { value: 'player', label: 'Player' },
  { value: 'other', label: 'Other' },
]

interface Draft {
  id?: string
  title: string
  category: ArticleCategory
  imageUrl: string
  content: string
  isPublished: boolean
}

const EMPTY_DRAFT: Draft = {
  title: '',
  category: 'news',
  imageUrl: '',
  content: '',
  isPublished: true,
}

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const load = async () => {
    try {
      setArticles(await ArticleManager.getAll())
    } catch (err) {
      console.error('Error loading articles:', err)
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const startCreate = () => setDraft({ ...EMPTY_DRAFT })
  const startEdit = (a: Article) =>
    setDraft({
      id: a.id,
      title: a.title,
      category: a.category,
      imageUrl: a.imageUrl || '',
      content: a.content,
      isPublished: a.isPublished,
    })

  const handleSave = async () => {
    if (!draft || !draft.title.trim() || !draft.content.trim()) {
      alert('Title and content are required.')
      return
    }
    setIsSaving(true)
    try {
      if (draft.id) {
        await ArticleManager.update(draft.id, {
          title: draft.title,
          category: draft.category,
          imageUrl: draft.imageUrl,
          content: draft.content,
          isPublished: draft.isPublished,
        })
      } else {
        await ArticleManager.add({
          title: draft.title,
          category: draft.category,
          imageUrl: draft.imageUrl,
          content: draft.content,
          isPublished: draft.isPublished,
        })
      }
      setDraft(null)
      await load()
    } catch (err: any) {
      alert(err?.message || 'Failed to save article.')
    } finally {
      setIsSaving(false)
    }
  }

  const togglePublish = async (a: Article) => {
    try {
      await ArticleManager.update(a.id, { isPublished: !a.isPublished })
      setArticles(prev => prev.map(x => (x.id === a.id ? { ...x, isPublished: !x.isPublished } : x)))
    } catch {
      alert('Failed to update publish state.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return
    try {
      await ArticleManager.delete(id)
      setArticles(prev => prev.filter(a => a.id !== id))
    } catch {
      alert('Failed to delete article.')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg sm:text-xl">News &amp; Articles</h1>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 h-9">
          <Plus size={16} /> New Article
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-3" />
            <p className="text-sm font-semibold">Loading articles…</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-16 text-center border rounded-xl bg-white text-slate-400">
            <Newspaper className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="font-semibold text-slate-500">No articles yet</p>
            <p className="text-xs mt-1">Click “New Article” to publish your first story. It appears on the public News page instantly.</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl">
            {articles.map(a => (
              <div key={a.id} className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {a.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.imageUrl} alt={a.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <Newspaper size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{a.category}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${a.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {a.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 truncate mt-0.5">{a.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{articleDate(a)}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => togglePublish(a)} title={a.isPublished ? 'Unpublish' : 'Publish'} className="p-2 rounded-md text-slate-500 hover:bg-slate-100">
                    {a.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => startEdit(a)} title="Edit" className="p-2 rounded-md text-slate-500 hover:bg-slate-100">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(a.id)} title="Delete" className="p-2 rounded-md text-red-500 hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor modal */}
      {draft && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">{draft.id ? 'Edit Article' : 'New Article'}</h3>
              <button onClick={() => setDraft(null)} className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={e => setDraft({ ...draft, title: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Headline of the article"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">Category</label>
                <select
                  value={draft.category}
                  onChange={e => setDraft({ ...draft, category: e.target.value as ArticleCategory })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">Featured Image</label>
                <ImageUpload
                  folder="news"
                  shape="banner"
                  label=""
                  value={draft.imageUrl}
                  onChange={url => setDraft({ ...draft, imageUrl: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">Content</label>
                <textarea
                  rows={10}
                  value={draft.content}
                  onChange={e => setDraft({ ...draft, content: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  placeholder="Write the full article here. Separate paragraphs with a blank line."
                />
                <p className="text-xs text-slate-400 mt-1">Paragraphs are split on blank lines. The excerpt and read time are generated automatically.</p>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={draft.isPublished}
                  onChange={e => setDraft({ ...draft, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-700">Publish immediately (visible on the public site)</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDraft(null)} className="font-medium">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check size={16} />}
                {draft.id ? 'Save Changes' : 'Create Article'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
