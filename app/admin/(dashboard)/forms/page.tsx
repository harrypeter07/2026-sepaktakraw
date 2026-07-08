'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SettingsManager } from '@/lib/site-settings'
import { FormField, FormSchema } from '@/lib/types'
import { extractTextFromDocx, extractTextFromPdf, parseTextToFields } from '@/lib/form-parser-utils'
import { Button } from '@/components/ui/button'
import { 
  UploadCloud, MoveUp, MoveDown, PlusCircle, Send, Check, Trash2, Loader2, Link2 
} from 'lucide-react'

export default function FormBuilderAdminPage() {
  const [schema, setSchema] = useState<FormSchema>({
    id: 'contact',
    title: 'Contact Form',
    fields: []
  })
  const [isUploading, setIsUploading] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const allSettings = await SettingsManager.getAll()
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
        console.error('Error loading dynamic form schema:', err)
      } finally {
        setIsLoaded(true)
      }
    }
    loadSchema()
  }, [])

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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Topbar Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div>
          <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Form Builder Template Parser</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/contact" 
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 transition flex items-center gap-1"
          >
            <Link2 size={12} />
            View Public Form
          </Link>
        </div>
      </header>

      {/* Workspace panel */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 space-y-6">
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-3" />
            <p className="text-sm font-semibold">Loading Form Schema...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
