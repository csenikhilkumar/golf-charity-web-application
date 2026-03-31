'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { Bell, Trophy, Target, Megaphone, Check, Trash, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { getNotifications, markAsRead, markAllAsRead } from '@/app/dashboard/notifications/actions'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function NotificationBell() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const fetchNotifications = async () => {
    if (!user) return
    const res = await getNotifications(user.id)
    setNotifications(res.notifications)
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  // Refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !isOpen) {
        fetchNotifications()
      }
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user, isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      await markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    })
  }

  const handleMarkAllRead = () => {
    if (!user) return
    startTransition(async () => {
      await markAllAsRead(user.id)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'WINNER': return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'DRAW': return <Target className="h-4 w-4 text-primary" />
      case 'COMMUNITY': return <Megaphone className="h-4 w-4 text-emerald-500" />
      default: return <Bell className="h-4 w-4 text-primary" />
    }
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Notifications"
      >
        <Bell className={cn("h-[1.2rem] w-[1.2rem] text-foreground transition-all", unreadCount > 0 && "animate-wiggle")} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 origin-top-right bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-[70] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
            <h3 className="font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto divide-y divide-border">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "p-4 flex gap-4 transition-colors hover:bg-muted/30 relative",
                    !n.isRead && "bg-primary/5"
                  )}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id, { preventDefault: () => {}, stopPropagation: () => {} } as any)}
                >
                  <div className={cn(
                    "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center",
                    !n.isRead ? "bg-white shadow-sm ring-1 ring-primary/20" : "bg-muted"
                  )}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={cn("text-sm truncate", !n.isRead ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
                        {n.title}
                      </p>
                      <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
                        {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <Bell className="h-8 w-8 text-muted-foreground opacity-20 mb-3" />
                <p className="text-sm text-muted-foreground font-medium">No notifications yet.</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border bg-muted/10">
            <Link 
              href="/dashboard" 
              className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              View Your Scoreboard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
