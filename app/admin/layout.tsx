'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import Link from 'next/link'
import { 
  Users, 
  Heart, 
  Trophy, 
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { checkAdminRole } from './actions'

const adminNavItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Charities', href: '/admin/charities', icon: Heart },
  { name: 'Draws', href: '/admin/draws', icon: Trophy },
  { name: 'Winners', href: '/admin/winners', icon: Trophy },
  { name: 'Updates', href: '/admin/system-updates', icon: LayoutDashboard },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const pathname = usePathname()
  const [status, setStatus] = useState<'loading' | 'authorized' | 'denied'>('loading')

  const verifyAdmin = useCallback(async (userId: string) => {
    const isAdmin = await checkAdminRole(userId)
    if (isAdmin) {
      setStatus('authorized')
    } else {
      setStatus('denied')
      window.location.href = '/dashboard'
    }
  }, [router])

  useEffect(() => {
    if (pathname === '/admin/login' || authLoading || status === 'authorized') return

    if (!user) {
      router.push('/admin/login')
      return
    }

    verifyAdmin(user.id)
  }, [user?.id, authLoading, verifyAdmin, pathname])

  // Skip auth guard for the login page itself to avoid infinite redirect loop
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Verifying Admin Access...</p>
        </div>
      </div>
    )
  }

  if (status === 'denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">You do not have admin permissions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Admin Sidebar */}
        <aside className="w-64 hidden lg:flex flex-col sticky top-24 h-[calc(100vh-8rem)]">
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-4 h-full shadow-sm flex flex-col">
            <div className="mb-6 px-4 py-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Admin Console</p>
            </div>
            <nav className="flex-1 space-y-1.5">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "group-hover:scale-110 transition-transform")} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                  </Link>
                )
              })}
            </nav>
            <div className="pt-6 mt-auto border-t border-border/50 px-2">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to App
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pb-12">
          {children}
        </main>
      </div>
    </div>
  )
}
