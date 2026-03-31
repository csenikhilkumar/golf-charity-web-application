import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Heart, 
  Trophy, 
  TrendingUp, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  // Fetch high-level stats
  const totalUsers = await prisma.user.count()
  const activeSubs = await prisma.subscription.count({ where: { status: 'ACTIVE' } })
  const totalCharities = await prisma.charity.count()
  
  // Simple aggregate for total raised (placeholder logic)
  const totalRaisedResult = await prisma.winnerRecord.aggregate({
    _sum: { prizeAmount: true }
  })
  const totalWinnings = totalRaisedResult._sum.prizeAmount || 0
  // In reality, impact is 40% of revenue. For now we use winnings as a proxy or just show 0.
  const totalImpact = totalWinnings * 0.25 // Example math

  const stats = [
    { name: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    { name: 'Active Subs', value: activeSubs, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
    { name: 'Charities', value: totalCharities, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-600/10' },
    { name: 'Total Payouts', value: `$${totalWinnings.toFixed(0)}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-600/10' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Admin Overview
          </Badge>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight text-foreground">
            System <span className="text-primary italic">Health</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Monitor platform activity and manage the core engine.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/draws/new" className="px-6 h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center justify-center">
            Run Monthly Draw
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="rounded-3xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.name}</CardTitle>
              <div className={stat.bg + " p-2 rounded-xl"}>
                <stat.icon className={"h-5 w-5 " + stat.color} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold font-heading">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="text-emerald-600 font-bold mr-1">+0%</span> since last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Draw Status Card */}
        <Card className="lg:col-span-2 rounded-3xl border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-xl">Monthly Draws</CardTitle>
                <CardDescription>Track the status of the current month's lottery pools.</CardDescription>
              </div>
              <Trophy className="h-6 w-6 text-primary opacity-50" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-10 text-center flex flex-col items-center justify-center bg-background">
               <ShieldAlert className="h-12 w-12 text-muted-foreground/40 mb-4" />
               <h3 className="text-lg font-bold">No Active Draws</h3>
               <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
                 The March 2026 draw has not been initialized yet. Ready to simulate the results?
               </p>
               <Link href="/admin/draws/new" className="text-primary font-bold hover:underline flex items-center">
                  Initialize Draw System <ArrowUpRight className="h-4 w-4 ml-1" />
               </Link>
            </div>
          </CardContent>
        </Card>

        {/* Global Impact Summary */}
        <Card className="rounded-3xl border-border shadow-sm border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Global Impact</CardTitle>
            <CardDescription>Estimated charitable contributions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Raised for Charities</span>
                <span className="text-primary">$0.00</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[0%]" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/40">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Donors</p>
                <p className="text-2xl font-black font-heading">{activeSubs}</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Charities</p>
                <p className="text-2xl font-black font-heading">{totalCharities}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "Our mission is to turn every round of golf into a force for good. We track 40% of all subscription revenue as potential impact."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
