'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { checkAdminRole } from '@/app/admin/actions'

import { DashboardSidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  const checkAndRedirect = useCallback(async () => {
    if (!user) return
    const isAdmin = await checkAdminRole(user.id)
    if (isAdmin) {
      router.replace('/admin')
    }
  }, [user, router])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user) {
      checkAndRedirect()
    }
  }, [user, loading, router, checkAndRedirect])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 md:px-8 pt-4 pb-12 mt-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        <DashboardSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
