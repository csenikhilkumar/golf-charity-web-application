'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Target, Heart, ShieldCheck, ArrowRight, Trash2, Loader2, Sparkles } from 'lucide-react'
import { simulateDraw, publishDraw, deleteSimulation } from '../actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function NewDrawPage() {
  const [loading, setLoading] = useState(false)
  const [simulation, setSimulation] = useState<any>(null)
  const [drawType, setDrawType] = useState<'RANDOM' | 'ALGORITHMIC'>('RANDOM')

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const handleSimulate = async () => {
    setLoading(true)
    const res = await simulateDraw(month, year, drawType)
    if (res.success) {
      setSimulation(res)
      toast.success('Simulation completed successfully!')
    } else {
      toast.error('Simulation failed. Make sure you have active subscribers.')
    }
    setLoading(false)
  }

  const handlePublish = async () => {
    if (!simulation) return
    setLoading(true)
    const res = await publishDraw(simulation.draw.id, simulation.winners)
    if (res.success) {
      toast.success('Draw published! Winners have been notified.')
      setSimulation(null)
    } else {
      toast.error('Failed to publish draw.')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!simulation) return
    const res = await deleteSimulation(simulation.draw.id)
    if (res.success) {
      setSimulation(null)
      toast.info('Simulation deleted.')
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading tracking-tight text-foreground">Monthly Prize Draw</h1>
          <p className="text-muted-foreground mt-1">Configure and execute the lottery pool for {now.toLocaleString('default', { month: 'long' })} {year}.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Configuration Card */}
        <Card className="rounded-3xl border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Settings</CardTitle>
            <CardDescription>Select the draw algorithm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <button
                onClick={() => setDrawType('RANDOM')}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 text-left transition-all",
                  drawType === 'RANDOM' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <span className="font-bold">Standard Random</span>
                </div>
                <p className="text-xs text-muted-foreground">True cryptographic randomness for equal odds.</p>
              </button>

              <button
                onClick={() => setDrawType('ALGORITHMIC')}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 text-left transition-all",
                  drawType === 'ALGORITHMIC' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                  <span className="font-bold">Weighted (Pro)</span>
                </div>
                <p className="text-xs text-muted-foreground">Weights odds based on Stableford score metrics.</p>
              </button>
            </div>

            <Button 
              onClick={handleSimulate} 
              disabled={loading || !!simulation}
              className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20"
            >
              {loading && !simulation ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Run Pre-analysis
            </Button>
          </CardContent>
        </Card>

        {/* Results / Simulation Area */}
        <div className="md:col-span-2">
          {!simulation ? (
            <div className="h-[400px] rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-10 bg-muted/5">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-lg font-bold text-muted-foreground">Awaiting Simulation</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-2">
                Click "Run Pre-analysis" to generate winning numbers and preview potential winners based on current entries.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Prize Pool Summary */}
              <Card className="rounded-3xl border-border bg-primary text-primary-foreground overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80 mb-1">Estimated Prize Pool</p>
                      <h2 className="text-5xl font-black font-heading">${simulation.prizePool.toLocaleString()}</h2>
                    </div>
                    <div className="flex gap-2">
                      {simulation.draw.numbers.map((num: number) => (
                        <div key={num} className="h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center font-bold shadow-lg">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <p className="text-xs font-bold uppercase text-primary-foreground/70 mb-1">Potential Winners</p>
                      <p className="text-3xl font-black">{simulation.winners.length}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <p className="text-xs font-bold uppercase text-primary-foreground/70 mb-1">Pool Match Ratio</p>
                      <p className="text-3xl font-black">100%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Potential Winners List */}
              <Card className="rounded-3xl border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Winners Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {simulation.winners.length > 0 ? (
                    <div className="divide-y divide-border">
                      {simulation.winners.map((winner: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                              {winner.userId.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-foreground capitalize">
                                 {winner.matchType.replace('_', ' ').toLowerCase()} Match
                               </p>
                               <p className="text-[10px] text-muted-foreground font-medium truncate w-32">UID: {winner.userId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-emerald-600">+${winner.prizeAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-muted-foreground italic">
                      No winners found for these numbers. Prize pool will roll over to the jackpot.
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center gap-3 pt-4">
                <Button 
                  onClick={handlePublish} 
                  disabled={loading}
                  className="flex-1 rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/20"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
                  Finalize & Publish
                </Button>
                <Button 
                  onClick={handleDelete}
                  disabled={loading}
                  variant="outline" 
                  className="h-14 rounded-2xl w-14 p-0 text-muted-foreground hover:bg-destructive/5 hover:text-destructive border-border"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
