'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Megaphone, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { broadcastUpdate } from './actions'
import { toast } from 'sonner'

export default function SystemUpdatesPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sentCount, setSentCount] = useState<number | null>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    setIsSending(true)
    const result = await broadcastUpdate(title, content)
    setIsSending(false)

    if (result.success) {
      toast.success('Broadcast sent successfully!')
      setSentCount(result.count || 0)
      setTitle('')
      setContent('')
    } else {
      toast.error('Failed to send broadcast')
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
          <Megaphone className="w-4 h-4 mr-2 inline" />
          Internal Comms
        </Badge>
        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-foreground">
          System <span className="text-primary italic">Updates</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Broadcast important announcements to all active subscribers.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="font-heading text-xl">New Broadcast</CardTitle>
              <CardDescription>Compose your message below. This will be sent as a branded email.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Subject Line</label>
                  <Input 
                    placeholder="e.g. New Prize Categories Added!" 
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    required
                    className="h-12 rounded-xl focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Message Content</label>
                  <Textarea 
                    placeholder="Write your update here..." 
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    required
                    className="min-h-[200px] rounded-xl focus-visible:ring-primary p-4"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSending || !title || !content}
                  className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending to users...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Broadcast Email
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="rounded-3xl border-border shadow-sm bg-primary/5 border-primary/10 h-full">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {sentCount !== null ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-emerald-100 p-3 rounded-2xl mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold">Latest Batch Complete</h3>
                  <p className="text-muted-foreground mt-1">
                    Sent to {sentCount} subscribers.
                  </p>
                  <Button variant="outline" className="mt-6 rounded-xl" onClick={() => setSentCount(null)}>
                    Send Another
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground italic">
                    "Reach your community directly. Branded updates ensure high visibility."
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
