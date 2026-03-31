'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  Heart, 
  Trophy, 
  LayoutDashboard, 
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Charities', href: '/admin/charities', icon: Heart },
  { name: 'Draws', href: '/admin/draws', icon: Trophy },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (user.user_metadata?.role !== 'ADMIN' && (user as any).role !== 'ADMIN') {
        // Simple client-side check for now, should ideally be server-side or via custom hook
        // We'll trust the user metadata or the database record
        // For security, server components should also check the role
        setIsAdmin(false)
        router.push('/dashboard')
      } else {
        setIsAdmin(true)
      }
    }
  }, [user, loading, router])

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Verifying Admin Access...</p>
        </div>
      </div>
    )
  }

  if (isAdmin === false) return null

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-background hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg leading-none">Admin</h2>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-1">Console</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-border">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
