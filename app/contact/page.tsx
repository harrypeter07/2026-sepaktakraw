'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useSiteSettings } from '@/lib/site-settings'
import { FormSubmissionManager } from '@/lib/data-manager'
import { FormSchema, FormField } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Check, Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const { txt, isLoaded } = useSiteSettings()
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Hydrate custom form schema from site settings
  useEffect(() => {
    if (isLoaded) {
      try {
        const rawSchema = txt('site.custom_form_schema')
        if (rawSchema) {
          const parsed = JSON.parse(rawSchema)
          if (parsed && parsed.fields) {
            setSchema(parsed)
            // Initialize form data
            const initialData: Record<string, any> = {}
            parsed.fields.forEach((field: FormField) => {
              initialData[field.id] = field.type === 'select' && field.options && field.options.length > 0
                ? field.options[0]
                : ''
            })
            setFormData(initialData)
            return
          }
        }
      } catch (err) {
        console.error('Failed to parse form schema, using fallback.', err)
      }

      // Default fallback contact schema
      const fallbackSchema: FormSchema = {
        id: 'contact',
        title: 'Contact Form',
        fields: [
          { id: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Rahul Sharma' },
          { id: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'e.g. rahul@example.com' },
          { id: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: 'e.g. +91 98765 43210' },
          { id: 'category', label: 'Query Category', type: 'select', required: true, options: ['General Inquiry', 'Join a Team', 'Tournament Inquiry', 'Sponsorship Opportunity', 'Other'] },
          { id: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'What is this regarding?' },
          { id: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Type your message here...' }
        ]
      }
      setSchema(fallbackSchema)
      const initialData: Record<string, any> = {}
      fallbackSchema.fields.forEach((field) => {
        initialData[field.id] = field.type === 'select' && field.options && field.options.length > 0
          ? field.options[0]
          : ''
      })
      setFormData(initialData)
    }
  }, [isLoaded, txt])

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    // Clear field error on typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const validateForm = (): boolean => {
    if (!schema) return false
    const newErrors: Record<string, string> = {}

    schema.fields.forEach(field => {
      const val = formData[field.id]?.toString().trim()
      
      // Required check
      if (field.required && !val) {
        newErrors[field.id] = `${field.label} is required.`
      }

      // Format check
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
        answers: formData
      })
      setSubmitSuccess(true)
      // Reset form data
      const resetData: Record<string, any> = {}
      schema.fields.forEach(field => {
        resetData[field.id] = field.type === 'select' && field.options && field.options.length > 0
          ? field.options[0]
          : ''
      })
      setFormData(resetData)
    } catch (err) {
      console.error('Submission failed:', err)
      setErrors({ _form: 'Something went wrong. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-slate-50/50">
        {/* Page Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24 border-b border-primary/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Get in touch with the Maharashtra Sepaktakraw Association. We are here to answer your queries and welcome collaborations.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Contact Info Sidebar */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect With Us</h2>
                    <p className="text-muted-foreground">
                      Reach out directly, visit our regional offices, or send us a message through the form.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border shadow-sm">
                      <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Address</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {txt('site.footer_contact_address', 'Maharashtra, India')}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border shadow-sm">
                      <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Phone</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {txt('site.footer_contact_phone', '+91 (XXX) XXX-XXXX')}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border shadow-sm">
                      <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Email</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {txt('site.footer_contact_email', 'info@msa.org.in')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtext info */}
                <div className="hidden lg:block p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-1">Regional Office Hours</h4>
                  <p className="text-xs text-blue-800/80 leading-relaxed">
                    Monday – Saturday: 10:00 AM – 6:00 PM IST<br />
                    Sundays & Holidays: Closed
                  </p>
                </div>
              </div>

              {/* Form Container */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-10">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {schema?.title || 'Send a Message'}
                  </h2>

                  {submitSuccess ? (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-8 text-center">
                      <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
                        <Check size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-emerald-900 mb-2">Message Sent Successfully!</h3>
                      <p className="text-emerald-800/80 max-w-md mx-auto mb-6">
                        Thank you for contacting us. We have received your query and our team will get back to you as soon as possible.
                      </p>
                      <Button 
                        onClick={() => setSubmitSuccess(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {errors._form && (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-100 text-red-700">
                          <AlertCircle size={20} className="shrink-0" />
                          <p className="text-sm font-medium">{errors._form}</p>
                        </div>
                      )}

                      {!schema ? (
                        <div className="space-y-4 py-8 text-center text-muted-foreground">
                          <p>Loading form fields...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {schema.fields.map((field) => {
                            const isFullWidth = field.type === 'textarea' || field.id === 'subject' || field.id === 'message'
                            const errorMsg = errors[field.id]

                            return (
                              <div 
                                key={field.id} 
                                className={`flex flex-col space-y-1.5 ${isFullWidth ? 'sm:col-span-2' : ''}`}
                              >
                                <label 
                                  htmlFor={field.id} 
                                  className="text-sm font-medium text-slate-700 flex items-center gap-1"
                                >
                                  {field.label}
                                  {field.required && (
                                    <span className="text-red-500 font-bold" aria-hidden="true">*</span>
                                  )}
                                </label>

                                {field.type === 'textarea' ? (
                                  <textarea
                                    id={field.id}
                                    rows={4}
                                    placeholder={field.placeholder || ''}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                                      errorMsg ? 'border-red-500 focus-visible:ring-red-500' : 'focus:border-blue-500'
                                    }`}
                                  />
                                ) : field.type === 'select' ? (
                                  <select
                                    id={field.id}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                                      errorMsg ? 'border-red-500 focus-visible:ring-red-500' : 'focus:border-blue-500'
                                    }`}
                                  >
                                    {field.options?.map(opt => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    id={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder || ''}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                                      errorMsg ? 'border-red-500 focus-visible:ring-red-500' : 'focus:border-blue-500'
                                    }`}
                                  />
                                )}

                                {errorMsg && (
                                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} />
                                    {errorMsg}
                                  </p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <div className="pt-4 border-t flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !schema}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 h-10 transition-all flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Send Message
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
      <Footer />
    </>
  )
}
