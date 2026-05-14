import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trophy, Users, Zap, Target } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <Image
            src="/hero.jpg"
            alt="Sepaktakraw action"
            fill
            className="object-cover absolute inset-0 -z-10"
            priority
          />
          <div className="absolute inset-0 bg-black/40 -z-10"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6">
              Maharashtra Sepaktakraw
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-balance opacity-90">
              Excellence in Asian Kick-Volleyball Sport
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/tournaments">View Tournaments</Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 sm:py-24 bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-balance">
                  What is Sepaktakraw?
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Sepaktakraw is a Southeast Asian team sport that combines elements of volleyball and martial arts. Players use their feet, knees, chest, and head to hit a rattan ball over a net, showcasing remarkable agility and precision.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  The Maharashtra Sepaktakraw Association is dedicated to promoting this dynamic sport, developing athletes, and organizing competitive tournaments across the region.
                </p>
                <Button asChild size="lg">
                  <Link href="/about">Explore Our Mission</Link>
                </Button>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/team.jpg"
                  alt="Sepaktakraw team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-balance">
              Our Focus Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition">
                <Trophy className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Tournaments</h3>
                <p className="text-muted-foreground text-sm">
                  Competitive events showcasing player talent and team excellence
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition">
                <Users className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Team Management</h3>
                <p className="text-muted-foreground text-sm">
                  Supporting clubs and teams in player development and coordination
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition">
                <Zap className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Player Development</h3>
                <p className="text-muted-foreground text-sm">
                  Nurturing young talent and advancing athletic capabilities
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition">
                <Target className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Community Growth</h3>
                <p className="text-muted-foreground text-sm">
                  Building the Sepaktakraw community across Maharashtra
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6 text-balance">
              Ready to Join the Action?
            </h2>
            <p className="text-xl mb-8 opacity-90 text-balance">
              Explore our tournaments, teams, and players to stay connected with the sport
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/tournaments">Browse Tournaments</Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
