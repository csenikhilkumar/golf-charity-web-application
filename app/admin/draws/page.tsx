import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  LayoutList,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function AdminDrawsPage() {
  const draws = await prisma.draw.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { winners: true, entries: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading tracking-tight text-foreground">Lottery Pools</h1>
          <p className="text-muted-foreground mt-1">Manage monthly draws, simulations, and prize distributions.</p>
        </div>
        <Link 
          href="/admin/draws/new" 
          className="inline-flex items-center justify-center rounded-xl h-11 px-6 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Draw
        </Link>
      </div>

      <div className="grid gap-4">
        {draws.map((draw) => (
          <Card key={draw.id} className="rounded-2xl border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Status Indicator */}
                <div className={cn(
                  "w-full md:w-2 bg-muted p-2 md:p-0",
                  draw.status === 'PUBLISHED' ? "bg-emerald-500" : "bg-amber-500"
                )} />

                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-muted flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-muted-foreground uppercase">{new Date(0, draw.month - 1).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-bold leading-none">{draw.year.toString().slice(-2)}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{new Date(0, draw.month - 1).toLocaleString('default', { month: 'long' })} {draw.year}</h3>
                        <Badge variant={draw.status === 'PUBLISHED' ? 'default' : 'secondary'} className="rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {draw.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <LayoutList className="h-3 w-3" />
                          {draw._count.entries} Entries
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {draw._count.winners} Winners
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Published: {draw.publishedAt ? new Date(draw.publishedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Prize Pool</p>
                      <p className="text-xl font-black text-foreground">${draw.prizePool.toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2">
                       {draw.numbers.map((num) => (
                         <div key={num} className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold shadow-sm">
                           {num}
                         </div>
                       ))}
                    </div>

                    <Button variant="outline" className="rounded-xl h-10 border-border hover:border-primary hover:text-primary">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {draws.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
            <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-muted-foreground">No draws found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Initialize your first monthly draw to get started.</p>
            <Link 
              href="/admin/draws/new" 
              className="text-primary font-bold hover:underline flex items-center justify-center"
            >
              Start Simulation <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
