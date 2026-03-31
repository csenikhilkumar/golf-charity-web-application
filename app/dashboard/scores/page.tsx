'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getScoresHistory, deleteScore } from './actions'
import { ScoreEntryForm } from '@/components/dashboard/ScoreEntryForm'
import { useDashboard } from '@/components/providers/dashboard-provider'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Target, History, Badge as BadgeIcon, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ScoresPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { data, loading, refreshData } = useDashboard()
  const scores = data?.user?.scores || []

  const handleSuccess = async () => {
    await refreshData()
  }

  const handleDelete = async (scoreId: string) => {
    if (!user) return router.push('/login')
    
    const res = await deleteScore(scoreId, user.id)
    if (!res.error) {
      await refreshData()
    } else {
      console.error(res.error)
    }
  }

  useEffect(() => {
    if (!data && !loading) {
      refreshData()
    }
  }, [data, loading, refreshData])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-1 text-foreground">Score Management</h1>
          <p className="text-muted-foreground">Log your Stableford points and track your rolling average.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <Card className="rounded-3xl border-border shadow-md sticky top-6">
            <CardHeader className="bg-primary/5 rounded-t-3xl border-b border-border pb-6">
              <CardTitle className="font-heading flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Submit a Score
              </CardTitle>
              <CardDescription>
                Your latest 5 scores determine your rolling average for the next draw.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ScoreEntryForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-border shadow-sm h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading flex items-center gap-2 text-xl">
                  <History className="h-5 w-5 text-primary" />
                  Rolling History
                </CardTitle>
                <Badge variant="outline" className="font-mono bg-muted/50">
                  {scores.length} / 5 Scores
                </Badge>
              </div>
              <CardDescription>
                Only your most recent 5 scores are kept in the system to calculate your draw probability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4 pt-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                  ))}
                </div>
              ) : scores.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 border border-dashed border-border rounded-2xl">
                  <BadgeIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">No scores logged yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Submit your first score to enter the draws!</p>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {scores.map((score: any, idx: number) => (
                    <div 
                      key={score.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4 rounded-2xl border border-border bg-card/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg font-heading">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg">{score.value} <span className="text-sm font-normal text-muted-foreground">pts</span></p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(score.datePlayed).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={idx === 0 ? "default" : "secondary"}>
                          {idx === 0 ? 'Latest' : 'Active'}
                        </Badge>
                        <button 
                          onClick={() => handleDelete(score.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2 -mr-2 rounded-full hover:bg-destructive/10"
                          title="Delete Score"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
