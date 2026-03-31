'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserWinnings, submitWinnerProof } from './actions'
import { useDashboard } from '@/components/providers/dashboard-provider'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, CheckCircle2, AlertCircle, Link as LinkIcon, ExternalLink } from 'lucide-react'

export default function WinningsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { data, loading, refreshData } = useDashboard()
  const winnings = data?.user?.winnings || []
  
  // Form State for each winning ID
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!data && !loading) {
      refreshData()
    }
  }, [data, loading, refreshData])

  const handleSubmitProof = async (winningId: string) => {
    const url = proofUrls[winningId]
    if (!url) return

    setSubmitting(prev => ({ ...prev, [winningId]: true }))
    
    setSubmitting(prev => ({ ...prev, [winningId]: true }))
    
    const res = await submitWinnerProof(winningId, url, user!.id)
    if (res.error) {
      alert(res.error)
    } else {
      await refreshData()
      setProofUrls(prev => ({ ...prev, [winningId]: '' }))
    }
    
    setSubmitting(prev => ({ ...prev, [winningId]: false }))
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1 text-foreground flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            My Winnings
          </h1>
          <p className="text-muted-foreground">Submit proof and claim your prizes from the monthly draws.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      ) : winnings.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-3xl">
          <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading mb-2">No Winnings Yet</h2>
          <p className="text-muted-foreground">Keep entering your scores! The next draw could be yours.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {winnings.map((win) => {
            const isPendingProof = win.status === 'PENDING' && !win.proofUrl
            const isAwaitingApproval = win.status === 'PENDING' && win.proofUrl
            
            return (
              <Card key={win.id} className="rounded-3xl border-border shadow-md overflow-hidden flex flex-col">
                <div className={`h-2 w-full ${win.status === 'APPROVED' || win.status === 'PAID' ? 'bg-emerald-500' : 'bg-primary'}`} />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold mb-1 font-heading text-emerald-600">
                        ${win.prizeAmount.toFixed(2)}
                      </CardTitle>
                      <CardDescription className="capitalize font-medium text-foreground">
                        {win.matchType.replace('_', ' ').toLowerCase()} Winner
                      </CardDescription>
                    </div>
                    <Badge variant={win.status === 'PAID' ? 'default' : 'outline'} className="uppercase">
                      {win.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">Draw:</strong> {win.draw.month}/{win.draw.year} ({win.draw.drawType.toLowerCase()})</p>
                    <p><strong className="text-foreground">Won on:</strong> {new Date(win.createdAt).toLocaleDateString()}</p>
                  </div>

                  {isPendingProof && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-500">
                        <AlertCircle className="h-4 w-4" />
                        Proof Required
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Please provide a link (e.g. Google Drive, Dropbox, iCloud) to a photo of your scorecard or digital entry matching the winning record.
                      </p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="https://link-to-proof.com/..." 
                            className="pl-9 h-10 rounded-lg"
                            value={proofUrls[win.id] || ''}
                            onChange={(e) => setProofUrls(prev => ({ ...prev, [win.id]: e.target.value }))}
                          />
                        </div>
                        <Button 
                          onClick={() => handleSubmitProof(win.id)}
                          disabled={submitting[win.id] || !proofUrls[win.id]}
                          className="rounded-lg shadow-md"
                        >
                          {submitting[win.id] ? 'Sending...' : 'Submit'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {isAwaitingApproval && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                      <p className="font-semibold text-foreground">Proof Submitted</p>
                      <p className="text-xs text-muted-foreground">We are reviewing your submission. This usually takes 1-2 business days.</p>
                      <a href={win.proofUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center mt-2">
                        View submitted proof <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}

                  {(win.status === 'APPROVED' || win.status === 'PAID') && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col items-center text-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      <p className="font-semibold text-emerald-700 mt-2">
                        {win.status === 'PAID' ? 'Prize Paid Out!' : 'Proof Approved!'}
                      </p>
                      {win.status === 'APPROVED' && (
                        <p className="text-xs text-emerald-600/80 mt-1">Look out for your payout via your selected payment method.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
