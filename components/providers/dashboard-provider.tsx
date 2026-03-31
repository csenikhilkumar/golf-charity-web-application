'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from './auth-provider'
import { getDashboardData, syncStripeSession } from '@/app/dashboard/actions'

interface DashboardContextType {
  data: any | null
  loading: boolean
  refreshData: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType>({
  data: null,
  loading: true,
  refreshData: async () => {},
})

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async (force = false) => {
    if (!user) return
    
    // Only show loading if we don't have data already
    if (force || !data) {
      setLoading(true)
    }

    try {
      // Handle Stripe sync if session_id exists
      const searchParams = new URLSearchParams(window.location.search)
      const sessionId = searchParams.get('session_id')
      if (sessionId) {
        await syncStripeSession(sessionId)
        // Clear param without reload
        const url = new URL(window.location.href)
        url.searchParams.delete('session_id')
        window.history.replaceState({}, '', url.toString())
      }

      const res = await getDashboardData(user.id, user.email, user.user_metadata?.name || '')
      if (res.user) {
        setData(res)
      }
    } catch (err) {
      console.error('Error in DashboardProvider loadData:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && user) {
      loadData()
    } else if (!authLoading && !user) {
      setData(null)
      setLoading(false)
    }
  }, [user, authLoading])

  const value = useMemo(() => ({ data, loading, refreshData: () => loadData(true) }), [data, loading, loadData])

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => useContext(DashboardContext)
