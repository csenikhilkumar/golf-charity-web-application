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
import { WinnerRow } from './winner-row'

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
                    <WinnerRow key={winner.id} winner={winner} />
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
