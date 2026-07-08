'use client'

import siteContent from '@/lib/site-content.json'

export default function SiteContentSettingsPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center px-6 shrink-0 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg sm:text-xl">Site Content & Layout Copy</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">Static Content Management</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Site branding, copy text, fact numbers, and default image assets are now managed statically inside the codebase in the local 
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-xs mx-1">lib/site-content.json</code> file.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              This completely eliminates database queries, loading state flashes, and fallback issues on public pages.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Current Static Configuration Preview</h3>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono max-h-96 overflow-y-auto whitespace-pre-wrap select-all">
              {JSON.stringify(siteContent, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}
