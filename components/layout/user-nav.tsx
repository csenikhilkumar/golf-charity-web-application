'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  User as UserIcon, 
  LayoutDashboard, 
  Trophy, 
  Target, 
  Settings, 
  LogOut,
  ChevronDown,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useDashboard } from '@/components/providers/dashboard-provider'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function UserNav() {
  const { user } = useAuth()
  const { data } = useDashboard()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const dbUser = data?.user
  const initials = dbUser?.name ? dbUser.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')
  const displayName = dbUser?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Member'
  const imageUrl = dbUser?.imageUrl

  const allMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Scores', href: '/dashboard/scores', icon: Target },
    { name: 'Winnings', href: '/dashboard/winnings', icon: Trophy },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const menuItems = dbUser?.role === 'ADMIN' 
    ? allMenuItems.filter(item => !['Dashboard', 'My Scores', 'Winnings'].includes(item.name))
    : allMenuItems

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 group"
      >
        <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm overflow-hidden ring-offset-background group-hover:ring-2 group-hover:ring-primary/50 transition-all">
          {imageUrl ? (
            <img src={imageUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="hidden sm:flex flex-col items-start mr-1">
          <span className="text-sm font-semibold text-foreground leading-none mb-1">
            {displayName}
          </span>
          <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
            {dbUser?.role === 'ADMIN' ? 'Admin' : 'Premium'}
          </span>
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={cn(
          "absolute right-0 mt-2 w-64 origin-top-right bg-background border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 z-[60] backdrop-blur-xl",
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        )}
      >
        <div className="p-4 bg-muted/30 border-b border-border/50">
          <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate font-medium">{user.email}</p>
        </div>

        <div className="py-2">
          {dbUser?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-b border-border/30"
              onClick={() => setIsOpen(false)}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Console
            </Link>
          )}
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4 opacity-70" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="border-t border-border/50 py-2">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="h-4 w-4 opacity-70" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
