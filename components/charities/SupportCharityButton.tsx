'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { updateUserCharity, getUserCharity } from '@/app/charities/[id]/actions'
import { toast } from 'sonner'
import { Check } from 'lucide-react'

interface SupportCharityButtonProps {
  charityId: string
  charityName: string
}

export function SupportCharityButton({ charityId, charityName }: SupportCharityButtonProps) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [currentCharityId, setCurrentCharityId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { charityId } = await getUserCharity(user.id)
        setCurrentCharityId(charityId)
      }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [])

  const handleUpdateCharity = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const res = await updateUserCharity(userId, charityId)
      if (res.success) {
        toast.success(`Successfully updated your charity to ${charityName}!`)
        router.push('/dashboard')
      } else {
        toast.error(res.error || 'Failed to update charity.')
      }
    } catch (err) {
      toast.error('An error occurred while updating your charity.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="w-full h-14 bg-primary-foreground/10 animate-pulse rounded-full" />
    )
  }

  if (userId) {
    const isSelected = currentCharityId === charityId

    if (isSelected) {
      return (
        <div className="flex items-center justify-center gap-2 w-full h-14 bg-green-500/10 text-green-600 border-2 border-green-500/20 rounded-full font-bold text-lg">
          <Check className="h-5 w-5" />
          Currently Supporting
        </div>
      )
    }

    return (
      <button
        onClick={handleUpdateCharity}
        disabled={loading}
        className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full rounded-full h-14 font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70")}
      >
        {loading ? 'Updating...' : 'Set as My Charity'}
      </button>
    )
  }

  return (
    <Link 
      href={`/signup?charityId=${charityId}`}
      className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full rounded-full h-14 font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02]")}
    >
      Select as My Charity
    </Link>
  )
}
