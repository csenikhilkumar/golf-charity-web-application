'use client'

import { useState } from 'react'
import { submitScore } from '@/app/dashboard/scores/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export function ScoreEntryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [value, setValue] = useState<string>('')
  const [datePlayed, setDatePlayed] = useState<string>(
    new Date().toISOString().split('T')[0] // default to today
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const scoreValue = parseInt(value, 10)
    
    if (isNaN(scoreValue) || scoreValue < 1 || scoreValue > 45) {
      setError('Score must be a valid number between 1 and 45')
      setLoading(false)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('You must be logged in to submit a score')
      setLoading(false)
      return
    }

    const res = await submitScore(session.user.id, scoreValue, datePlayed)
    if (res.error) {
      setError(res.error)
    } else {
      setValue('')
      setDatePlayed(new Date().toISOString().split('T')[0])
      if (onSuccess) onSuccess()
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="datePlayed">Date Played</Label>
        <Input 
          id="datePlayed"
          type="date" 
          required 
          value={datePlayed}
          onChange={(e) => setDatePlayed(e.target.value)}
          max={new Date().toISOString().split('T')[0]} // Cannot be in the future
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scoreValue">Stableford Points (1-45)</Label>
        <Input 
          id="scoreValue"
          type="number" 
          min="1" 
          max="45" 
          required 
          placeholder="e.g. 36"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter your total Stableford points for the 18 holes.
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-md font-semibold mt-4 shadow-lg shadow-primary/25">
        {loading ? 'Submitting...' : 'Submit Score'}
      </Button>
    </form>
  )
}
