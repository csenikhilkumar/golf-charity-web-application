'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Activity, 
  Trophy, 
  Star,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Scores', href: '/dashboard/scores', icon: Activity },
  { name: 'Winnings', href: '/dashboard/winnings', icon: Trophy },
  { name: 'Wall of Fame', href: '/winners', icon: Star },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-100px)] sticky top-24">
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-4 h-full shadow-sm">
        <div className="mb-8 px-4 py-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Main Menu</p>
        </div>
        
        <nav className="space-y-1.5">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href))
            const Icon = link.icon
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "group-hover:scale-110 transition-transform")} />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto px-4 py-6">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase mb-1">PRO Membership</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are supporting <strong>Save the Children</strong>
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
