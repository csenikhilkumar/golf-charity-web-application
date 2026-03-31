'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { buttonVariants } from '@/components/ui/button-variants'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Target } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  // App router useSearchParams to get optional selected charity
  const searchParams = useSearchParams()
  const defaultCharityId = searchParams.get('charityId') || ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1. Sign up on Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone_number: phone
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. We redirect to dashboard or a "complete profile" flow
    // In many Supabase setups, a DB trigger automatically creates the User record in public.User
    // BUT since we are using Prisma, we'll let Prisma handle the mapping, or we manually create it here
    
    // For now, let's redirect to dashboard
    // If email confirmations are off, authData.user will be active.
    if (authData.user) {
      router.push('/dashboard')
    }
  }

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background rounded-3xl p-8 border border-border shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Target className="h-8 w-8 text-primary group-hover:rotate-180 transition-transform duration-700" />
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center font-heading text-foreground mb-2">
          Join the Movement
        </h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          Create an account to participate in draws and make an impact.
        </p>

        {defaultCharityId && (
          <div className="bg-primary/10 text-primary text-sm p-3 rounded-xl mb-6 font-medium text-center border border-primary/20">
            You're signing up to support a selected charity!
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl mb-6 border border-destructive/20">
            {error}
          </div>
        )}

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

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 rounded-xl bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="phone">
              Phone Number <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl bg-muted/50"
            />
          </div>

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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 rounded-xl bg-muted/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(buttonVariants({ size: "lg" }), "w-full h-12 rounded-xl text-base shadow-lg shadow-primary/25 disabled:opacity-70 transition-all mt-4")}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
