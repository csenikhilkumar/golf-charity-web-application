'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Target, 
  ShieldCheck, 
  Trash2, 
  Loader2, 
  ChevronLeft,
  Calendar,
  LayoutList,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import { publishDraw, deleteSimulation } from '../actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface DrawViewProps {
  draw: any
  winners: any[]
}

export default function DrawView({ draw, winners }: DrawViewProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePublish = async () => {
    setLoading(true)
    const res = await publishDraw(draw.id, winners)
    if (res.success) {
      toast.success('Draw published! Winners have been notified.')
      router.refresh()
    } else {
      toast.error('Failed to publish draw.')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    const res = await deleteSimulation(draw.id)
    if (res.success) {
      toast.info('Simulation deleted.')
      router.push('/admin/draws')
      router.refresh()
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/draws"
            className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold font-heading tracking-tight text-foreground">
              {new Date(0, draw.month - 1).toLocaleString('default', { month: 'long' })} {draw.year}
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <Badge variant={draw.status === 'PUBLISHED' ? 'default' : 'secondary'} className="rounded-full text-[10px] font-bold uppercase tracking-wider">
                 {draw.status}
               </Badge>
               <span className="text-muted-foreground text-xs font-medium">Draw ID: {draw.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Draw Info Card */}
        <Card className="rounded-3xl border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Pool Details</CardTitle>
            <CardDescription>Configuration and stats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
               <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground font-medium">Draw Type</span>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase">{draw.drawType}</Badge>
               </div>
               <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground font-medium">Created On</span>
                  <span className="text-sm font-bold">{new Date(draw.createdAt).toLocaleDateString()}</span>
               </div>
               {draw.publishedAt && (
                 <div className="flex items-center justify-between py-1 border-b border-border/50">
                    <span className="text-sm text-muted-foreground font-medium">Published At</span>
                    <span className="text-sm font-bold">{new Date(draw.publishedAt).toLocaleDateString()}</span>
                 </div>
               )}
            </div>

            {draw.status === 'SIMULATION' && (
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  onClick={handlePublish} 
                  disabled={loading}
                  className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-primary/20"
                >
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                  Publish Results
                </Button>
                <Button 
                  onClick={handleDelete}
                  disabled={loading}
                  variant="outline"
                  className="w-full rounded-2xl h-12 font-bold text-destructive hover:bg-destructive/5 hover:text-destructive"
                >
                   <Trash2 className="h-4 w-4 mr-2" />
                   Discard Simulation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className={cn(
            "rounded-3xl border-border overflow-hidden text-white",
            draw.status === 'PUBLISHED' ? "bg-emerald-600" : "bg-primary"
          )}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-1">Total Prize Pool</p>
                  <h2 className="text-5xl font-black font-heading">${draw.prizePool.toLocaleString()}</h2>
                </div>
                <div className="flex gap-2">
                  {draw.numbers.map((num: number) => (
                    <div key={num} className="h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center font-bold shadow-lg">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-xs font-bold uppercase text-white/70 mb-1">Validated Winners</p>
                  <p className="text-3xl font-black">{winners.length}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl text-white">
                  <p className="text-xs font-bold uppercase text-white/70 mb-1">Draw Confidence</p>
                  <p className="text-3xl font-black">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Winners Table */}
          <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-heading">Winners List</CardTitle>
                <CardDescription>Verified for {draw.month}/{draw.year} sequence.</CardDescription>
              </div>
              <Badge variant="outline" className="bg-background">{winners.length} Claims</Badge>
            </CardHeader>
            <CardContent className="p-0">
              {winners.length > 0 ? (
                <div className="divide-y divide-border">
                  {winners.map((winner: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {winner.userId ? winner.userId.substring(0, 2).toUpperCase() : 'W'}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-foreground capitalize">
                             {winner.matchType.replace('_', ' ').toLowerCase()} Match
                           </p>
                           <div className="flex items-center gap-4 mt-0.5">
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">UID: {winner.userId}</span>
                              {draw.status === 'PUBLISHED' && (
                                <Badge className="text-[9px] h-4 uppercase font-bold bg-emerald-500/10 text-emerald-600 border-none">Record Created</Badge>
                              )}
                           </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-emerald-600 text-lg">+${winner.prizeAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                   <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <LayoutList className="h-6 w-6 text-muted-foreground/30" />
                   </div>
                   <h3 className="text-sm font-bold text-muted-foreground uppercase">No matches found</h3>
                   <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto italic">
                     This draw resulted in no winners. The prize pool will be added to the next jackpot.
                   </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
