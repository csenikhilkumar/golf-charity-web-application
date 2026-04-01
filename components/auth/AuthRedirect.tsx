'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

/**
 * A small utility component that redirects authenticated users 
 * from the landing page to the dashboard.
 */
export function AuthRedirect() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      window.location.href = '/dashboard'
    }
  }, [user, loading])

  return null
}
