'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trophy, Users, Zap, Target, ArrowRight, MapPin } from 'lucide-react'
import { useSiteSettings } from '@/lib/site-settings'
import { TeamManager, PlayerManager, TournamentManager } from '@/lib/data-manager'

const FOCUS_AREAS = [
  { icon: Trophy, title: 'Tournaments', desc: 'Competitive events showcasing player talent and team excellence across the state.' },
  { icon: Users, title: 'Team Management', desc: 'Supporting clubs and teams in player development, logistics and coordination.' },
  { icon: Zap, title: 'Player Development', desc: 'Nurturing young talent and advancing athletic capabilities at every level.' },
  { icon: Target, title: 'Community Growth', desc: 'Building a thriving Sepaktakraw community across all of Maharashtra.' },
]

export default function Home() {
  const { img, txt, alt } = useSiteSettings()
  const [stats, setStats] = useState({ teams: 0, players: 0, tournaments: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const [teams, players, tournaments] = await Promise.all([
          TeamManager.getAll(),
          PlayerManager.getAll(),
          TournamentManager.getAll(),
        ])
        setStats({
          teams: teams.length || 12,
          players: players.length || 180,
          tournaments: tournaments.length || 24,
        })
      } catch {
        setStats({ teams: 12, players: 180, tournaments: 24 })
      }
    }
    load()
  }, [])

  const heroImage = img('home.hero.image', '/hero.jpg')

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-background">
        {/* Hero */}
        <section className="relative flex min-h-[88vh] items-center overflow-hidden clip-angle-b">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={alt('home.hero.image', 'Sepaktakraw action')}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background/95 via-background/80 to-background/40" />
          <div className="absolute inset-0 -z-10 spotlight" />

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="kicker mb-6">Maharashtra Sepaktakraw Association</span>
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
                {txt('home.hero.title', 'Maharashtra Sepaktakraw')}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground text-balance sm:text-xl">
                {txt('home.hero.subtitle', 'Excellence in Asian Kick-Volleyball Sport')}
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/tournaments">
                    View Tournaments <ArrowRight className="ml-1" size={18} />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  variant="outline"
                  className="border-border bg-card/40 text-foreground backdrop-blur hover:bg-card"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-4 py-10 sm:px-6 lg:px-8">
            {[
              { label: 'Registered Teams', value: stats.teams },
              { label: 'Active Players', value: stats.players },
              { label: 'Tournaments Held', value: stats.tournaments },
            ].map((s) => (
              <div key={s.label} className="rise-in text-center">
                <div className="text-4xl font-extrabold tracking-tight text-accent sm:text-5xl">
                  {s.value}
                  <span className="text-accent/70">+</span>
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="bg-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div>
                <span className="kicker mb-4">The Sport</span>
                <h2 className="text-4xl font-bold text-balance">What is Sepaktakraw?</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Sepaktakraw is a Southeast Asian team sport that fuses volleyball with martial
                  arts. Players use their feet, knees, chest and head to send a rattan ball over a
                  net — a spectacular display of agility, timing and precision.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  The Maharashtra Sepaktakraw Association promotes this dynamic sport, develops
                  athletes and organises competitive tournaments across the region.
                </p>
                <Button asChild size="lg" className="mt-8">
                  <Link href="/about">
                    Explore Our Mission <ArrowRight className="ml-1" size={18} />
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <div className="absolute -inset-3 -z-10 rounded-2xl bg-accent/10 blur-xl" />
                <div className="relative h-96 overflow-hidden rounded-2xl border border-border shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img('home.about.image', '/team.jpg')}
                    alt={alt('home.about.image', 'Sepaktakraw team')}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Focus areas */}
        <section className="bg-card py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="kicker mb-4 justify-center">What We Do</span>
              <h2 className="text-4xl font-bold text-balance">Our Focus Areas</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FOCUS_AREAS.map(({ icon: Icon, title, desc }) => (
                <Card
                  key={title}
                  className="group relative overflow-hidden border-border bg-background p-6 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28">
          {img('home.cta.image') && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img('home.cta.image')}
                alt=""
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
              />
              <div className="absolute inset-0 -z-10 bg-primary/70" />
            </>
          )}
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <span className="kicker mb-4 justify-center">Get Involved</span>
            <h2 className="text-4xl font-bold text-balance">Ready to Join the Action?</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-balance opacity-90">
              Explore our tournaments, teams and players to stay connected with the sport.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/tournaments">Browse Tournaments</Link>
              </Button>
              <Button
                size="lg"
                asChild
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/teams">
                  <MapPin className="mr-1" size={18} /> Meet the Teams
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
