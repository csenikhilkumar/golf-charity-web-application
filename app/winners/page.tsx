import { prisma } from '@/lib/prisma'
import { Trophy, Calendar, Star, Users, ArrowRight, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Wall of Fame | Winners',
  description: 'Celebrating our lucky winners and the impact they make.'
}

export default async function WinnersPage() {
  const publishedDraws = await prisma.draw.findMany({
    where: { 
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      winners: {
        include: { user: { select: { name: true, username: true, email: true } } },
        orderBy: { prizeAmount: 'desc' }
      }
    }
  })

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-16 px-4 animate-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
            <Trophy className="w-4 h-4 mr-2 inline" />
            Wall of Fame
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight text-foreground mb-6">
            Meet the <span className="text-primary relative inline-block">Winners<svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg></span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Celebrating our community's success. Every win contributes to our partner charities.
          </p>
        </div>

        {publishedDraws.length > 0 ? (
          <div className="grid gap-12 max-w-5xl mx-auto">
            {publishedDraws.map((draw) => (
              <section key={draw.id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="flex items-center gap-4 mb-6">
                   <div className="h-12 w-12 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary border border-primary/20">
                      <span className="text-[10px] font-black uppercase">
                        {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][draw.month - 1]}
                      </span>
                      <span className="text-lg font-bold leading-none">{draw.year.toString().slice(-2)}</span>
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold font-heading">{['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'][draw.month - 1]} {draw.year}</h2>
                      <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Published {new Date(draw.publishedAt!).toLocaleDateString()}
                      </p>
                   </div>
                   <div className="ml-auto hidden md:flex gap-2">
                      {draw.numbers.map((num) => (
                        <div key={num} className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold shadow-sm">
                           {num}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draw.winners.map((win, i) => (
                    <Card key={win.id} className="rounded-3xl border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
                       <CardContent className="p-0">
                          <div className={cn(
                            "h-1.5 w-full",
                            win.matchType === 'FIVE_NUMBER' ? "bg-yellow-400" : 
                            win.matchType === 'FOUR_NUMBER' ? "bg-primary" : "bg-muted-foreground/30"
                          )} />
                          <div className="p-6">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold shadow-inner">
                                   {win.user?.name ? win.user.name.charAt(0).toUpperCase() : (win.user?.email ? win.user.email.charAt(0).toUpperCase() : 'G')}
                                </div>
                                <div>
                                   <p className="font-bold text-foreground leading-tight">
                                     {win.user?.name || win.user?.username || (win.user?.email ? win.user.email.split('@')[0] : 'Member')}
                                   </p>
                                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                     {win.matchType.replace('_', ' ').toLowerCase()} Match
                                   </p>
                                </div>
                             </div>
                             <div className="flex items-end justify-between">
                                <div className="text-2xl font-black text-emerald-600">
                                   ${win.prizeAmount.toLocaleString()}
                                </div>
                                <Trophy className={cn(
                                  "h-5 w-5 opacity-20 group-hover:opacity-100 transition-opacity",
                                  win.matchType === 'FIVE_NUMBER' ? "text-yellow-500" : "text-primary"
                                )} />
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <Card className="rounded-3xl border-dashed border-2 border-border/60 bg-muted/10 overflow-hidden max-w-4xl mx-auto shadow-sm">
            <CardContent className="flex flex-col items-center justify-center p-16 text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                <Star className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">
                The First Draw is Approaching!
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
                We are getting ready to announce our very first round of lucky winners. Make sure your latest scores are logged!
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                Enter My Scores <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
