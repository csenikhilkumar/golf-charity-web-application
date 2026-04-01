import Link from 'next/link'
import { Target, Heart, Trophy, UserPlus } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto w-full">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <Target className="h-6 w-6 text-primary group-hover:rotate-180 transition-transform duration-700" />
              <span className="font-heading text-xl font-bold tracking-tight text-primary">
                Golf Charity
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
              Play the game you love. Change the lives they deserve. Join our exclusive draws, track your scores, and automatically donate to handpicked charities making a real impact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold font-heading text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/charities" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Heart className="h-3 w-3" /> Charities
                </Link>
              </li>
              <li>
                <Link href="/winners" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Trophy className="h-3 w-3" /> Winners Wall
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h3 className="font-bold font-heading text-foreground mb-4">Membership</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/signup" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <UserPlus className="h-3 w-3" /> Join the Club
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Member Login
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Global Impact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Golf Charity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
