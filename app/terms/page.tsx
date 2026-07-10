'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { PageHero } from '@/components/page-hero'

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <PageHero
        title="Terms of Service"
        subtitle="Last Updated: July 10, 2026"
        kicker="Maharashtra Sepaktakraw Association"
      />

      <main className="flex-grow py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-border shadow-sm space-y-8 text-sm md:text-base leading-relaxed text-slate-700">
          
          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">1. Agreement to Terms</h2>
            <p>
              By accessing our website at any domain owned by the Maharashtra Sepaktakraw Association (MSTA), you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on MSTA&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on MSTA&apos;s website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
            </ul>
            <p>
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by MSTA at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">3. Disclaimer</h2>
            <p>
              The materials on MSTA&apos;s website are provided on an &apos;as is&apos; basis. MSTA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">4. Limitations of Liability</h2>
            <p>
              In no event shall MSTA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MSTA&apos;s website, even if MSTA or an MSTA authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on MSTA&apos;s website could include technical, typographical, or photographic errors. MSTA does not warrant that any of the materials on its website are accurate, complete or current. MSTA may make changes to the materials contained on its website at any time without notice. However MSTA does not make any commitment to update the materials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">6. Links</h2>
            <p>
              MSTA has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MSTA of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">7. Modifications</h2>
            <p>
              MSTA may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Maharashtra, India and you irrevocably submit to the exclusive jurisdiction of the courts in Nagpur, Maharashtra.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
