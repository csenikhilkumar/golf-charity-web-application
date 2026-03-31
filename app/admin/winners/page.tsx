import { prisma } from '@/lib/prisma'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function AdminWinnersPage() {
  const winnerRecords = await prisma.winnerRecord.findMany({
    include: {
      user: true,
      draw: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Group stats
  const pendingCount = winnerRecords.filter(w => w.status === 'PENDING').length
  const totalPayout = winnerRecords.reduce((acc, w) => acc + (w.status === 'PAID' ? w.prizeAmount : 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading tracking-tight text-foreground text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Winner Verification</h1>
          <p className="text-muted-foreground mt-1">Review proof of scores and manage prize payouts.</p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 px-6 py-3 rounded-2xl border border-border/50">
          <div className="text-right">
            <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Total Paid Out</p>
            <p className="text-xl font-black text-foreground">${totalPayout.toLocaleString()}</p>
          </div>
          <div className="h-8 w-px bg-border/50" />
          <div className="text-right">
            <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Pending Verification</p>
            <p className="text-xl font-black text-primary">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">Claims Inbox</CardTitle>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Live Updates</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {winnerRecords.length > 0 ? (
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-bold">Claimant</TableHead>
                    <TableHead className="font-bold">Draw Period</TableHead>
                    <TableHead className="font-bold">Match / Prize</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {winnerRecords.map((winner) => (
                    <TableRow key={winner.id} className="border-border hover:bg-muted/10 transition-colors">
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                            {winner.user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-foreground leading-none mb-1">{winner.user.name || 'Member'}</p>
                            <p className="text-[11px] text-muted-foreground font-medium">{winner.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{new Date(0, winner.draw.month - 1).toLocaleString('default', { month: 'long' })} {winner.draw.year}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black">Draw ID: {winner.draw.id.slice(-6)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 mb-1">
                             <Trophy className="h-3.5 w-3.5 text-amber-500" />
                             <span className="font-bold text-sm capitalize">{winner.matchType.replace('_', ' ').toLowerCase()} Match</span>
                          </div>
                          <span className="font-black text-emerald-600">${winner.prizeAmount.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "rounded-full text-[10px] font-black uppercase tracking-wider border-none",
                          winner.status === 'PAID' ? "bg-emerald-500/10 text-emerald-600" :
                          winner.status === 'PENDING' ? "bg-amber-500/10 text-amber-600" :
                          winner.status === 'APPROVED' ? "bg-blue-500/10 text-blue-600" :
                          "bg-rose-500/10 text-rose-600"
                        )}>
                          {winner.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" className="rounded-xl h-9 border-border bg-background hover:border-primary hover:text-primary transition-all">
                             Review Proof
                             <ExternalLink className="ml-2 h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 hover:bg-muted">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-background">
                 <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
                 <h3 className="text-lg font-bold text-muted-foreground">No prize claims found</h3>
                 <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                   Once draws are published and winners submit their score cards for verification, they will appear here.
                 </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
