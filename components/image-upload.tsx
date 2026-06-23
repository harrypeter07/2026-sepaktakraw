'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  /** Current image URL (public Supabase Storage URL). */
  value?: string
  /** Called with the new public URL after a successful upload, or '' when removed. */
  onChange: (url: string) => void
  /** Sub-folder inside the `media` bucket, e.g. 'teams' | 'players' | 'tournaments'. */
  folder: string
  label?: string
  /** 'avatar' = small square (logos/photos), 'banner' = wide 16:9 (tournaments). */
  shape?: 'avatar' | 'banner'
}

const MAX_BYTES = 5 * 1024 * 1024 // keep in sync with the bucket's file_size_limit

export function ImageUpload({
  value,
  onChange,
  folder,
  label = 'Image',
  shape = 'avatar',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be 5 MB or smaller.')
      return
    }

    setIsUploading(true)
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('media').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const previewClasses =
    shape === 'banner'
      ? 'aspect-video w-full'
      : 'h-24 w-24 rounded-full'

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}

      <div className="flex items-center gap-4">
        <div
          className={`${previewClasses} overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0 ${
            shape === 'banner' ? 'rounded-lg' : ''
          }`}
        >
          {value ? (
            // Remote Supabase URLs render via a plain <img> to avoid next/image
            // remote-pattern configuration; bucket images are already optimized.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" /> {value ? 'Replace' : 'Upload'}
                </>
              )}
            </button>

            {value && !isUploading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" /> Remove
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP or SVG · up to 5 MB</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = '' // allow re-selecting the same file
        }}
      />
    </div>
  )
}
