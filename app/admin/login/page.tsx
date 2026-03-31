'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { buttonVariants } from '@/components/ui/button-variants'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ShieldCheck, Lock } from 'lucide-react'
import { checkAdminRole } from '../actions'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // After successful auth, verify this user is actually an admin
    const isAdmin = await checkAdminRole(data.user.id)

    if (!isAdmin) {
      // Sign them back out — not an admin account
      await supabase.auth.signOut()
      setError('Access denied. This account does not have admin privileges.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-500">

        {/* Admin Badge */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
              <ShieldCheck className="h-9 w-9 text-white" />
            </div>
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-foreground">Admin Console</p>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-1">Golf Charity Platform</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-background rounded-3xl p-8 border border-border shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Restricted Access — Admins Only</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl mb-6 border border-destructive/20 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="admin-email">
                Admin Email
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@golfcharity.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="admin-password">
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'w-full h-12 rounded-xl text-base shadow-lg shadow-primary/25 disabled:opacity-70 transition-all mt-2'
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Sign In to Admin Console
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Not an admin?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Go to Member Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
