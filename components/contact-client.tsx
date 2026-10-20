'use client'

import { useState, useEffect } from 'react'
import { PageHero } from '@/components/page-hero'
import { useSiteSettings } from '@/lib/site-settings'
import { FormSubmissionManager } from '@/lib/data-manager'
import { FormSchema } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Check, Mail, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react'

function initialDataFor(schema: FormSchema): Record<string, string> {
  const data: Record<string, string> = {}
  schema.fields.forEach((field) => {
    data[field.id] =
      field.type === 'select' && field.options && field.options.length > 0
        ? field.options[0]
        : ''
  })
  return data
}

const FALLBACK_SCHEMA: FormSchema = {
  id: 'contact',
  title: 'Send a Message',
  fields: [
    { id: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Rahul Sharma' },
    { id: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'e.g. rahul@example.com' },
    { id: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: 'e.g. +91 98765 43210' },
    {
      id: 'category',
      label: 'Query Category',
      type: 'select',
      required: true,
      options: ['General Inquiry', 'Join a Team', 'Tournament Inquiry', 'Sponsorship Opportunity', 'Other'],
    },
    { id: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'What is this regarding?' },
    { id: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Type your message here...' },
  ],
}

export function ContactClient() {
  const { settings, isLoaded, txt } = useSiteSettings()
  const [schema, setSchema] = useState<FormSchema>(FALLBACK_SCHEMA)
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    initialDataFor(FALLBACK_SCHEMA)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    const rawSchema = settings['site.custom_form_schema']?.text
    if (rawSchema) {
      try {
        const parsed = JSON.parse(rawSchema)
        if (parsed && Array.isArray(parsed.fields)) {
          setSchema(parsed)
          setFormData(initialDataFor(parsed))
        }
      } catch (err) {
        console.error('Failed to parse form schema, using fallback.', err)
      }
    }
  }, [isLoaded, settings])

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const validateForm = (): boolean => {
    if (!schema) return false
    const newErrors: Record<string, string> = {}

    schema.fields.forEach((field) => {
      const val = formData[field.id]?.toString().trim()

      if (field.required && !val) {
        newErrors[field.id] = `${field.label} is required.`
      }
      if (val) {
        if (field.type === 'email' && !/\S+@\S+\.\S+/.test(val)) {
          newErrors[field.id] = 'Please enter a valid email address.'
        }
        if (field.type === 'number' && isNaN(Number(val))) {
          newErrors[field.id] = 'Please enter a valid number.'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !schema) return

    setIsSubmitting(true)
    try {
      await FormSubmissionManager.add({
        form_id: schema.id || 'contact',
        answers: formData,
      })
      setSubmitSuccess(true)
      setFormData(initialDataFor(schema))
    } catch (err) {
      console.error('Submission failed:', err)
      setErrors({ _form: 'Something went wrong. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactCards = [
    { icon: MapPin, label: 'Address', value: txt('site.footer_contact_address', 'Nagpur, Maharashtra, India') },
    { icon: Phone, label: 'Phone', value: txt('site.footer_contact_phone', '+91 98224 64555') },
    { icon: Mail, label: 'Email', value: txt('site.footer_contact_email', 'contact@mahasepaktakraw.com') },
  ]

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <PageHero
        imageKey="contact.hero.image"
        kicker="Get Involved"
        title="Get in Touch"
        subtitle="Questions, partnerships, or want to join a team? The Maharashtra Sepaktakraw Association is here."
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact info rail */}
            <aside className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.3em]">
                  Reach Us
                </span>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#0A0F1E] leading-tight">
                  Let's Talk
                  <br />
                  Sepaktakraw
                </h2>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  Reach out directly or send a message through the form. We respond to every genuine
                  enquiry.
                </p>
              </div>

              <div className="space-y-3">
                {contactCards.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb] transition group-hover:bg-[#2563eb] group-hover:text-white">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[#0A0F1E] break-words">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Office hours — dark brand block */}
              <div className="relative overflow-hidden rounded-2xl bg-[#1d4ed8] p-6">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="relative">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#93c5fd]">
                    Office Hours
                  </h4>
                  <p className="mt-3 text-sm font-medium text-white/70 leading-relaxed">
                    Monday – Saturday
                    <br />
                    <span className="font-black text-white">10:00 AM – 6:00 PM IST</span>
                    <br />
                    <span className="text-white/40">Sundays &amp; holidays: closed</span>
                  </p>
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-9">
                <div className="mb-7 flex items-center justify-between border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-[#0A0F1E]">
                    {schema?.title || 'Send a Message'}
                  </h2>
                  <div className="hidden sm:block h-1 w-16 rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8]" />
                </div>

                {submitSuccess ? (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center">
                    <div className="mb-4 inline-flex rounded-full bg-emerald-100 p-3 text-emerald-600">
                      <Check size={32} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-emerald-900">
                      Message Sent
                    </h3>
                    <p className="mx-auto mt-2 mb-6 max-w-md text-sm text-emerald-800/80 leading-relaxed">
                      Thanks for reaching out. Our team has received your message and will get back
                      to you shortly.
                    </p>
                    <Button
                      onClick={() => setSubmitSuccess(false)}
                      className="rounded-full bg-emerald-600 font-black uppercase tracking-wider text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errors._form && (
                      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-sm font-semibold">{errors._form}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {schema.fields.map((field) => {
                        const isFullWidth =
                          field.type === 'textarea' ||
                          field.id === 'subject' ||
                          field.id === 'message'
                        const errorMsg = errors[field.id]
                        const base =
                          'flex w-full rounded-xl border bg-white px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40 focus:border-[#2563eb] placeholder:text-slate-400 font-medium'
                        const borderCls = errorMsg
                          ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                          : 'border-slate-200'

                        return (
                          <div
                            key={field.id}
                            className={`flex flex-col gap-1.5 ${isFullWidth ? 'sm:col-span-2' : ''}`}
                          >
                            <label
                              htmlFor={field.id}
                              className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-slate-600"
                            >
                              {field.label}
                              {field.required && (
                                <span className="text-red-500" aria-hidden="true">
                                  *
                                </span>
                              )}
                            </label>

                            {field.type === 'textarea' ? (
                              <textarea
                                id={field.id}
                                rows={4}
                                placeholder={field.placeholder || ''}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className={`${base} py-2.5 ${borderCls}`}
                              />
                            ) : field.type === 'select' ? (
                              <select
                                id={field.id}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className={`${base} h-11 py-2 ${borderCls}`}
                              >
                                {field.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                id={field.id}
                                type={field.type}
                                placeholder={field.placeholder || ''}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className={`${base} h-11 py-2 ${borderCls}`}
                              />
                            )}

                            {errorMsg && (
                              <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-red-500">
                                <AlertCircle size={12} />
                                {errorMsg}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-5">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !schema}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2563eb] px-7 font-black uppercase tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message <ArrowRight size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
