import { Trophy, Calendar, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function WinnersPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-16 px-4 animate-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
            <Trophy className="w-4 h-4 mr-2 inline" />
            Wall of Fame
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight text-foreground mb-6">
            Meet the <span className="text-primary relative inline-block">Winners<svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg></span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Every month, subscribers across all handicap levels win big while supporting incredible causes. Will your name be next?
          </p>
        </div>

        {/* Empty State / Coming Soon */}
        <Card className="rounded-3xl border-dashed border-2 border-border/60 bg-muted/10 overflow-hidden max-w-4xl mx-auto shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Star className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">
              The First Draw is Approaching!
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
              We are getting ready to announce our very first round of lucky winners. Make sure your latest scores are logged and your membership is active!
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-background rounded-full border border-border text-foreground shadow-sm">
              <Calendar className="h-4 w-4 text-primary" />
              Check back at the end of the month
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
