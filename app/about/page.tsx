import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              About Maharashtra Sepaktakraw Association
            </h1>
            <p className="text-xl opacity-90 text-balance">
              Promoting excellence and growth in Southeast Asian kick-volleyball sport
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 sm:py-24 bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="p-8 border-2 border-primary">
                <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To promote, develop, and advance the sport of Sepaktakraw in Maharashtra by organizing competitive tournaments, developing world-class athletes, and building a thriving community of passionate players and fans. We are committed to excellence, fair play, and the growth of the sport at all levels.
                </p>
              </Card>
              <Card className="p-8 border-2 border-accent">
                <h2 className="text-3xl font-bold mb-4 text-accent">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To establish Maharashtra as a leading hub for Sepaktakraw in Asia, recognized for producing elite athletes and hosting premier international tournaments. We envision a thriving ecosystem where the sport continues to grow and inspire future generations.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-balance">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Excellence', description: 'Pursuing the highest standards in all aspects of the sport' },
                { title: 'Integrity', description: 'Upholding honesty and fair play in competition' },
                { title: 'Community', description: 'Building strong connections between players, teams, and fans' },
                { title: 'Innovation', description: 'Embracing new methods to develop athletes and improve the sport' },
              ].map((value) => (
                <Card key={value.title} className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-primary">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-16 sm:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-balance">Our Journey</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-xl font-bold mb-2">Founded</h3>
                <p className="text-muted-foreground">
                  Established as the official governing body for Sepaktakraw in Maharashtra, dedicated to promoting the sport and developing talent.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-2">Growth</h3>
                <p className="text-muted-foreground">
                  Expanded tournaments, supported more teams, and increased player participation across the region through grassroots development programs.
                </p>
              </div>
              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  Developed world-class athletes, hosted regional championships, and established Maharashtra as a competitive force in Asian Sepaktakraw.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
