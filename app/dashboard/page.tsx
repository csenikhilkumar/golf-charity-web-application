'use client'

import { useRouter } from 'next/navigation'
import { useDashboard } from '@/components/providers/dashboard-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Trophy, Target, Heart, ArrowRight, User as UserIcon, Calendar, Activity } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data, loading } = useDashboard()

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <UserIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-xl font-bold font-heading mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't load your dashboard data. Have you completed signup?</p>
        <Link href="/subscribe" className={buttonVariants()}>
          Complete Setup
        </Link>
      </div>
    )
  }

  const user = data.user
  const stats = data.stats
  const isSubscribed = user.subscription?.status === 'ACTIVE'
  const scoresCount = user.scores?.length || 0
  const recentScore = scoresCount > 0 ? user.scores[0] : null
  const rollingAverage = scoresCount > 0 
    ? (user.scores.reduce((acc: number, s: any) => acc + s.value, 0) / scoresCount).toFixed(1) 
    : '0.0'

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Welcome Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-2">Welcome back, {user.name || 'Golfer'}!</h1>
            <p className="text-muted-foreground">
              Ready to hit the links and make an impact today?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/scores" className={cn(buttonVariants({ size: "lg" }), "rounded-xl shadow-lg shadow-primary/20")}>
              Enter New Score
            </Link>
            {!isSubscribed && (
              <Link href="/subscribe" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-xl")}>
                Activate Membership
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Subscription / Charity Status */}
        <Card className="rounded-3xl border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Membership & Impact</CardTitle>
            <Heart className="h-5 w-5 text-primary opacity-75" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-2xl font-bold font-heading">
                {isSubscribed ? 'Active' : 'Inactive'}
              </span>
              {isSubscribed && (
                <div className="flex flex-col">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 w-fit">
                    {user.subscription.plan}
                  </Badge>
                </div>
              )}
            </div>
            {isSubscribed && user.subscription.currentPeriodEnd && (
               <p className="text-xs font-semibold text-muted-foreground mb-2 py-1 px-2 bg-muted/30 rounded-md w-fit inline-block">
                 Renews: {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
               </p>
            )}
            {user.charity ? (
              <p className="text-sm text-muted-foreground">
                Supporting <strong className="text-foreground">{user.charity.name}</strong> with a <strong className="text-foreground">{user.charityPct}%</strong> contribution.
              </p>
            ) : (
              <p className="text-sm text-destructive">No charity selected yet.</p>
            )}
          </CardContent>
          {user.charity && (
            <CardFooter className="pt-0 pb-5">
              <Link href="/charities" className="text-xs text-primary font-medium hover:underline flex items-center">
                Change Charity <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </CardFooter>
          )}
        </Card>

        {/* Scores Overview */}
        <Card className="rounded-3xl border-border shadow-sm flex flex-col">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Rolling Average</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground opacity-75" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold font-heading text-foreground mb-1">
              {rollingAverage} <span className="text-base font-normal text-muted-foreground">pts</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your last {scoresCount} submitted score{scoresCount !== 1 ? 's' : ''}.
            </p>
          </CardContent>
          <CardFooter className="pt-0 pb-5">
             <Link href="/dashboard/scores" className="text-xs text-primary font-medium hover:underline flex items-center">
                View History <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
          </CardFooter>
        </Card>

        {/* Draws Participation */}
        <Card className="rounded-3xl border-border shadow-sm flex flex-col">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Participation</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground opacity-75" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold font-heading text-foreground mb-1">
              {stats.participationCount} <span className="text-base font-normal text-muted-foreground">draws</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isSubscribed ? 'You are successfully entered into the next upcoming draw.' : 'Subscribe to enter upcoming draws!'}
            </p>
          </CardContent>
          <CardFooter className="pt-0 pb-5">
             <Link href="/winners" className="text-xs text-primary font-medium hover:underline flex items-center">
                Past Winners <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
          </CardFooter>
        </Card>

        {/* Recent Performance */}
        <Card className="rounded-3xl border-border shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Latest Score</CardTitle>
            <Target className="h-5 w-5 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            {recentScore ? (
              <>
                <div className="text-4xl font-bold font-heading mb-2">
                  {recentScore.value}
                </div>
                <div className="flex items-center text-sm text-primary-foreground/90 font-medium">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {new Date(recentScore.datePlayed).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}
                </div>
              </>
            ) : (
              <div className="py-4">
                <p className="text-primary-foreground/80 font-medium mb-3">No scores recorded yet.</p>
                <Link href="/dashboard/scores" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "rounded-lg h-9")}>
                  Enter First Score
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold font-heading">Recent Winners</h2>
            {stats.latestDraw && (
              <Badge variant="outline" className="text-[10px] font-bold uppercase py-1 border-primary/20 bg-primary/5 text-primary">
                {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][stats.latestDraw.month - 1]} {stats.latestDraw.year}
              </Badge>
            )}
          </div>
          <Card className="rounded-3xl border-border shadow-sm overflow-hidden h-fit">
            <CardContent className="p-0">
              {stats.latestDraw ? (
                <div className="divide-y divide-border">
                  <div className="p-6 bg-muted/20">
                     <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Winning Numbers</p>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">${stats.latestDraw.prizePool.toLocaleString()} Pool</p>
                     </div>
                     <div className="flex gap-2">
                        {stats.latestDraw.numbers.map((num: number) => (
                          <div key={num} className="h-9 w-9 rounded-full bg-white border border-border flex items-center justify-center text-sm font-bold shadow-sm">
                            {num}
                          </div>
                        ))}
                     </div>
                  </div>
                  {stats.latestDraw.winners.length > 0 ? (
                    <div className="divide-y divide-border">
                      {stats.latestDraw.winners.map((win: any, i: number) => (
                        <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shadow-inner">
                              {win.user?.name ? win.user.name.charAt(0).toUpperCase() : (win.user?.email ? win.user.email.charAt(0).toUpperCase() : 'G')}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-foreground">
                                 {win.user?.name || win.user?.username || (win.user?.email ? win.user.email.split('@')[0] : 'Member')}
                               </p>
                               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{win.matchType.replace('_', ' ').toLowerCase()} match</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-emerald-600">+${win.prizeAmount.toFixed(0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-muted-foreground italic text-sm">
                      No winners found for this draw.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-10 text-center bg-muted/20">
                   <Trophy className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                   <p className="text-sm text-muted-foreground font-medium">No recent draw data available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold font-heading">Trophy Room</h2>
            <div className="text-sm text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Total Won: ${stats.totalWon.toFixed(2)}
            </div>
          </div>
      <Card className="rounded-3xl border-border shadow-sm">
        <CardContent className="p-0">
          {user.winnings && user.winnings.length > 0 ? (
            <div className="divide-y divide-border">
              {user.winnings.map((win: any) => (
                <div key={win.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground capitalize tracking-tight">
                        {win.matchType.replace('_', ' ').toLowerCase()} Match
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {new Date(win.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-emerald-600">
                      +${win.prizeAmount.toFixed(2)}
                    </p>
                    <Badge variant="outline" className="text-xs uppercase mt-1">
                      {win.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="p-10 text-center flex flex-col items-center justify-center bg-muted/20">
               <Trophy className="h-12 w-12 text-muted-foreground/40 mb-3" />
               <p className="text-muted-foreground font-medium">No winnings yet. Enter scores to participate in the upcoming draws!</p>
             </div>
          )}
        </CardContent>
      </Card>
      
        </div>
      </div>
    </div>
  )
}
