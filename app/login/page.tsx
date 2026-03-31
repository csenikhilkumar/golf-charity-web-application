'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getURL } from '@/lib/get-url'
import { buttonVariants } from '@/components/ui/button-variants'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Target, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      toast.success('Logged in successfully!')
      // Use window.location.href for a full page reload to ensure 
      // Supabase session is fully propagated to the dashboard
      window.location.href = '/dashboard'
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address to reset your password.')
      return
    }
    if (resetSent && cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before requesting another link.`)
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}/dashboard/settings`,
    })

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setError('Email rate limit exceeded. Please wait a few minutes before trying again or check your inbox for an existing link.')
      } else {
        setError(error.message)
      }
    } else {
      toast.success('Password reset email sent! Check your inbox.')
      setResetSent(true)
      setCooldown(60)
      setResetMode(false)
    }
    setLoading(false)
  }

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${getURL()}/dashboard`
      }
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background rounded-3xl p-8 border border-border shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Target className="h-8 w-8 text-primary group-hover:rotate-180 transition-transform duration-700" />
            <span className="font-heading text-2xl font-bold tracking-tight text-primary">
              Golf Charity
            </span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center font-heading text-foreground mb-2">
          {resetMode ? 'Reset Password' : 'Welcome Back'}
        </h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          {resetMode 
            ? "Enter your email and we'll send you a link to reset your password." 
            : 'Log in to track your scores and manage your impact.'}
        </p>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl mb-6 border border-destructive/20">
            {error}
          </div>
        )}

        {!resetMode && (
          <>
            <button
              type="button"
              onClick={handleGoogleAuth}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full h-12 rounded-xl text-base mb-6 font-semibold flex items-center justify-center")}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={resetMode ? handleForgotPassword : handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl bg-muted/50"
            />
          </div>

          {!resetMode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground" htmlFor="password">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => setResetMode(true)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-muted/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={cn(buttonVariants({ size: "lg" }), "w-full h-12 rounded-xl text-base shadow-lg shadow-primary/25 disabled:opacity-70 transition-all")}
            >
              {loading ? 'Processing...' : (resetMode ? 'Send Reset Link' : 'Log In')}
            </button>

            {resetMode && (
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="w-full h-12 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            )}
          </div>
        </form>

        {!resetMode && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Register now
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
