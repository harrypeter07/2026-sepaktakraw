'use client'

import { useState, useEffect } from 'react'
import { FormSubmissionManager } from '@/lib/data-manager'
import { SettingsManager } from '@/lib/site-settings'
import { FormSchema, FormSubmission } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { 
  Eye, Archive, Trash2, X, RefreshCw, Loader2, AlertCircle, MessageSquare 
} from 'lucide-react'

export default function FormResponsesAdminPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [schema, setSchema] = useState<FormSchema>({
    id: 'contact',
    title: 'Contact Form',
    fields: []
  })
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const loadData = async () => {
    try {
      const [submissionsData, allSettings] = await Promise.all([
        FormSubmissionManager.getAll(),
        SettingsManager.getAll()
      ])
      
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
    } catch (err) {
      console.error('Error loading submissions data:', err)
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleUpdateStatus = async (id: string, status: any) => {
    try {
      await FormSubmissionManager.updateStatus(id, status)
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status } : null)
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      try {
        await FormSubmissionManager.delete(id)
        setSubmissions(prev => prev.filter(s => s.id !== id))
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null)
        }
      } catch (err) {
        alert('Failed to delete submission')
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Topbar Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div>
          <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Form Submission Responses</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadData}
            variant="outline"
            className="flex items-center gap-1.5 font-semibold h-9 text-xs"
          >
            <RefreshCw size={14} /> Refresh Responses
          </Button>
        </div>
      </header>

      {/* Main content pane */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-3" />
            <p className="text-sm font-semibold">Loading responses...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center border rounded-xl bg-white text-slate-400">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="font-semibold text-slate-500">No Submissions Found</p>
            <p className="text-xs mt-1">Contact form responses will be displayed here once users submit the form.</p>
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
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[submission.status]}`}>
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
                              onClick={() => handleUpdateStatus(submission.id, submission.status === 'read' ? 'archived' : 'read')}
                              className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-md transition"
                              title={submission.status === 'read' ? 'Archive' : 'Mark as Read'}
                            >
                              <Archive size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(submission.id)}
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

      {/* Detail View Modal */}
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
                      handleUpdateStatus(selectedSubmission.id, e.target.value as any)
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
                  {/* Legacy fields display */}
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
                onClick={() => handleDelete(selectedSubmission.id)}
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
    </div>
  )
}
