'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard, Heart, ShieldCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/auth-provider'
import { useDashboard } from '@/components/providers/dashboard-provider'
import { UserNav } from './user-nav'
import { ThemeToggle } from './theme-toggle'
import { NotificationBell } from './notification-bell'

const navLinks = [
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Charities', href: '/#charities' },
  { name: 'Impact', href: '/impact' },
  { name: 'Winners', href: '/winners' },
]

const dashboardLinks = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'My Scores', href: '/dashboard/scores' },
  { name: 'Winnings', href: '/dashboard/winnings' },
]

const adminLinks = [
  { name: 'Overview', href: '/admin' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Charities', href: '/admin/charities' },
  { name: 'Draws', href: '/admin/draws' },
  { name: 'Winners', href: '/admin/winners' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { session } = useAuth()
  const pathname = usePathname()
  const { data } = useDashboard()
  const dbUser = data?.user
  
  const initials = dbUser?.name ? dbUser.name.charAt(0).toUpperCase() : (session?.user?.email ? session.user.email.charAt(0).toUpperCase() : 'U')
  const displayName = dbUser?.name || session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'Member'
  const imageUrl = dbUser?.imageUrl
  
  const isAppRoute = pathname?.startsWith('/dashboard') || pathname === '/subscribe'
  const isAdminRoute = pathname?.startsWith('/admin')
  const isCharityFlow = pathname?.startsWith('/charities')
  const isWinnersPage = pathname === '/winners'
  
  // Desktop hides links on dashboard/admin/winners because they are secondary focus
  const desktopLinks = (isAdminRoute || isCharityFlow || isAppRoute || isWinnersPage) ? [] : navLinks
  
  // Mobile needs the dashboard/admin links since the sidebar is hidden
  const mobileLinks = isAppRoute ? dashboardLinks : isAdminRoute ? adminLinks : desktopLinks

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // No longer returning null, we show the header without links
  // if (isCharityFlow) return null

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-4 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-primary transition-transform group-hover:scale-105">
                Golf Charity
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {desktopLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
            {session ? (
              <div className="flex items-center gap-3">
                {dbUser?.role === 'ADMIN' ? (
                  !isAdminRoute && (
                    <Link 
                      href="/admin" 
                      className={cn(buttonVariants({ variant: "outline" }), "rounded-full transition-all border-primary/20 hover:bg-primary/5 text-primary font-bold")}
                    >
                      Admin Console
                    </Link>
                  )
                ) : (
                  !isAppRoute && (
                    <Link 
                      href="/dashboard" 
                      className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300")}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  )
                )}
                <UserNav />
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={cn(buttonVariants({ variant: "ghost" }), "hover:bg-primary/10 transition-colors")}
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 w-full")}
                >
                  Join the Club
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md transition-colors hover:bg-muted"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute w-full left-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          <nav className="flex flex-col gap-2">
            {mobileLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-lg font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-4 bg-muted/40 rounded-2xl border border-border/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{displayName}</p>
                    <p className="text-[10px] font-medium text-primary uppercase tracking-wider mt-0.5">
                      {dbUser?.role === 'ADMIN' ? 'Admin' : (dbUser?.subscription?.status === 'ACTIVE' ? 'Premium' : 'Member')}
                    </p>
                  </div>
                </div>
                {dbUser?.role === 'ADMIN' ? (
                  !isAdminRoute && (
                    <Link 
                      href="/admin" 
                      className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center rounded-xl h-12 text-base border-primary/20 text-primary font-bold")}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Admin Console
                    </Link>
                  )
                ) : (
                  !isAppRoute && (
                    <Link 
                      href="/dashboard" 
                      className={cn(buttonVariants({ variant: "default" }), "w-full justify-center rounded-xl h-12 text-base shadow-lg shadow-primary/20")}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Link>
                  )
                )}
                <button 
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center rounded-xl h-12 text-base text-destructive hover:bg-destructive/5")}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center h-12 text-base")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  className={cn(buttonVariants({ variant: "default" }), "w-full justify-center rounded-full h-12 text-base shadow-lg shadow-primary/25")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join the Club
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
