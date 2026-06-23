'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { ImageUpload } from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  SettingsManager,
  SETTING_DESCRIPTORS,
  SETTINGS_DEFAULTS,
  type SettingValue,
  type SiteSettings,
} from '@/lib/site-settings'

const PAGE_GROUPS: { id: string; title: string }[] = [
  { id: 'global', title: 'Global' },
  { id: 'home', title: 'Homepage' },
  { id: 'about', title: 'About Page' },
  { id: 'news', title: 'News Page' },
  { id: 'teams', title: 'Teams Page' },
  { id: 'players', title: 'Players Page' },
  { id: 'tournaments', title: 'Tournaments Page' },
]

export function SiteSettingsManager() {
  const [values, setValues] = useState<SiteSettings>(SETTINGS_DEFAULTS)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedKey, setSavedKey] = useState<string | null>(null)

  useEffect(() => {
    SettingsManager.getAll().then(setValues)
  }, [])

  const grouped = useMemo(
    () =>
      PAGE_GROUPS.map((g) => ({
        ...g,
        items: SETTING_DESCRIPTORS.filter((d) => d.page === g.id),
      })).filter((g) => g.items.length > 0),
    [],
  )

  const update = (key: string, patch: Partial<SettingValue>) =>
    setValues((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))

  const save = async (key: string) => {
    setSavingKey(key)
    setSavedKey(null)
    try {
      await SettingsManager.set(key, values[key] ?? {})
      setSavedKey(key)
      setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 2500)
    } catch (err: any) {
      alert(err?.message || 'Failed to save. Make sure migration 005 is applied and you are an admin.')
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold">Site Images & Content</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Upload and update the images and hero text shown across the public website. Changes are
          saved per item and take effect immediately. Images are stored in the public{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">media</code> bucket.
        </p>
      </div>

      {grouped.map((group) => (
        <div key={group.id}>
          <h3 className="mb-5 border-b border-border pb-2 text-lg font-bold text-accent">
            {group.title}
          </h3>
          <div className="space-y-8">
            {group.items.map((d) => {
              const value = values[d.key] ?? {}
              const isSaving = savingKey === d.key
              const isSaved = savedKey === d.key
              return (
                <div
                  key={d.key}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium">{d.label}</p>
                    <p className="mb-3 text-xs text-muted-foreground">{d.key}</p>

                    {d.type === 'image' ? (
                      <div className="space-y-3">
                        <ImageUpload
                          folder="site"
                          shape={d.shape ?? 'banner'}
                          label=""
                          value={value.url}
                          onChange={(url) => update(d.key, { url })}
                        />
                        <Input
                          placeholder="Alt text (for accessibility)"
                          value={value.alt ?? ''}
                          onChange={(e) => update(d.key, { alt: e.target.value })}
                          className="max-w-md"
                        />
                      </div>
                    ) : (
                      <Input
                        placeholder={d.default.text}
                        value={value.text ?? ''}
                        onChange={(e) => update(d.key, { text: e.target.value })}
                        className="max-w-md"
                      />
                    )}
                  </div>

                  <Button
                    onClick={() => save(d.key)}
                    disabled={isSaving}
                    className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Saving…
                      </>
                    ) : isSaved ? (
                      <>
                        <Check className="mr-1 h-4 w-4" /> Saved
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
