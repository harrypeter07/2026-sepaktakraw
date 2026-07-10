'use client'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { PageHero } from '@/components/page-hero'

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <PageHero
        title="Privacy Policy"
        subtitle="Last Updated: July 10, 2026"
        kicker="Maharashtra Sepaktakraw Association"
      />

      <main className="flex-grow py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-border shadow-sm space-y-8 text-sm md:text-base leading-relaxed text-slate-700">
          
          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">1. Introduction</h2>
            <p>
              Welcome to the Maharashtra Sepaktakraw Association (MSTA) website. We respect your privacy and are committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tells you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">2. The Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address, telephone numbers, and mailing address.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, and browser plug-in types and versions.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To register you as a player, team member, or official of the association.</li>
              <li>To manage our relationship with you including notifying you about changes to our terms or privacy policy.</li>
              <li>To administer and protect our website and services (including troubleshooting, data analysis, testing, system maintenance, support, and hosting of data).</li>
              <li>To process contact form submissions and coordinate support requests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those committee members, volunteers, and agents who have a business need to know.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">6. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, or restriction of processing of your personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">7. Contact Details</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="font-extrabold text-slate-800">
              Maharashtra Sepaktakraw Association (MSTA)<br />
              Email: maharashtrasepaktakraw@gmail.com
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
