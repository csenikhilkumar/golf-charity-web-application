import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { Trophy, Target, Heart, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AuthRedirect } from '@/components/auth/AuthRedirect'

export default async function Home() {
  const featuredCharities = await prisma.charity.findMany({
    where: { featured: true },
    take: 3
  })

  return (
    <div className="flex flex-col min-h-screen">
      <AuthRedirect />
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-36 lg:pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-4 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Join the movement today
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-foreground leading-tight">
              Play the Game You Love. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
                Change the Lives They Deserve.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Subscribe to our exclusive draws, track your scores, and automatically donate to handpicked charities making a real impact in the world.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/signup" 
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300")}
              >
                Join the Club
              </Link>
              <Link 
                href="#how-it-works" 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto h-14 px-8 text-lg rounded-full border-2 hover:bg-primary/5 transition-all duration-300")}
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
              Impact Made Simple
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your subscription fuels change while engaging you in monthly draws and a nationwide leaderboard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-green-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">1. Subscribe & Track</h3>
              <p className="text-muted-foreground leading-relaxed">
                Log your Stableford scores after each round. Our "Rolling 5" system automatically tracks your best and worst performances.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-green-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 inline-flex">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">2. Monthly Draws</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your subscription grants you entries into algorithmic and random monthly draws. Match the numbers to win cash prizes from the jackpot pool.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-green-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">3. Empower Charities</h3>
              <p className="text-muted-foreground leading-relaxed">
                A guaranteed 10% (or more) of your fee goes directly to your chosen featured charity. Make a difference with every swing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Charities Section */}
      <section id="charities" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
                Featured Charities
              </h2>
              <p className="text-lg text-muted-foreground">
                These incredible organizations are leading the charge. Choose one to support with your monthly or yearly membership.
              </p>
            </div>
            <Link 
              href="/charities" 
              className="inline-flex items-center text-primary font-medium hover:underline group"
            >
              View all charities
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCharities.map((charity) => (
              <div key={charity.id} className="group bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                <div className="h-48 relative overflow-hidden bg-muted">
                  {charity.imageUrl ? (
                    <img 
                      src={charity.name === 'The First Tee' ? 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop' : charity.imageUrl} 
                      alt={charity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-primary border border-primary/20">
                    Featured
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                    {charity.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                    {charity.description}
                  </p>
                  <Link 
                    href={`/charities/${charity.id}`}
                    className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-full group-hover:border-primary group-hover:text-primary transition-colors")}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Fallback card if empty db */}
            {featuredCharities.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-3xl">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No featured charities found</h3>
                <p className="text-muted-foreground">Run the seed script to populate data.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
