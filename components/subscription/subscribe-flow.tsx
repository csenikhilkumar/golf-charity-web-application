'use client'

import { useState } from 'react'
import { Charity } from '@prisma/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button-variants'
import { Target, Heart, CheckCircle2, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

const MONTHLY_PRICE = 99
const YEARLY_PRICE = 990 // 2 months free

export function SubscribeFlow({ charities }: { charities: Charity[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const preCharityId = searchParams.get('charityId')
  
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [charityId, setCharityId] = useState<string>(preCharityId || charities[0]?.id || '')
  const [percentage, setPercentage] = useState<number>(10)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [])
  
  const basePrice = billing === 'monthly' ? MONTHLY_PRICE : YEARLY_PRICE
  const charityAmount = (basePrice * (percentage / 100)).toFixed(2)

  const handleCheckout = async () => {
    if (!userId) {
      alert("Please ensure you are logged in to subscribe!")
      router.push('/login')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billing, charityId, percentage, userId })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to initialize secure checkout.')
      }
    } catch (err) {
      alert('A network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-foreground">
          Complete Your Membership
        </h1>
        <p className="text-lg text-muted-foreground">
          Join the community, enter the draws, and shape your impact.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3 space-y-8 animate-in slide-in-from-left-8 duration-700">
          
          {/* Step 1: Billing */}
          <section className="bg-background rounded-3xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center">
              <span className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Select Billing Cycle
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Monthly */}
              <div 
                className={cn("relative rounded-2xl border-2 p-6 cursor-pointer transition-all hover:border-primary/50", billing === 'monthly' ? "border-primary bg-primary/5 shadow-md" : "border-border")}
                onClick={() => setBilling('monthly')}
              >
                {billing === 'monthly' && <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />}
                <h3 className="text-lg font-bold">Monthly Plan</h3>
                <div className="mt-2 text-3xl font-bold text-foreground">
                  ${MONTHLY_PRICE}<span className="text-base font-normal text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Billed monthly. Cancel anytime.</p>
              </div>
              
              {/* Yearly */}
              <div 
                className={cn("relative rounded-2xl border-2 p-6 cursor-pointer transition-all hover:border-primary/50", billing === 'yearly' ? "border-primary bg-primary/5 shadow-md" : "border-border")}
                onClick={() => setBilling('yearly')}
              >
                {billing === 'yearly' && <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />}
                <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Save 16%
                </div>
                <h3 className="text-lg font-bold">Yearly Plan</h3>
                <div className="mt-2 text-3xl font-bold text-foreground">
                  ${YEARLY_PRICE}<span className="text-base font-normal text-muted-foreground">/yr</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Billed annually. Two months free.</p>
              </div>
            </div>
          </section>

          {/* Step 2: Charity Selection */}
          <section className="bg-background rounded-3xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center">
              <span className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Choose Your Charity
            </h2>
            <select 
              value={charityId} 
              onChange={(e) => setCharityId(e.target.value)}
              className="w-full h-14 px-4 rounded-xl border-2 border-border focus:border-primary focus:ring-0 bg-background text-foreground transition-colors appearance-none"
            >
              {charities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="mt-4 flex items-start gap-3 bg-muted/50 p-4 rounded-xl text-sm text-muted-foreground">
              <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p>
                We distribute a guaranteed base percentage of your subscription directly to the charity you pick above. You have the power to direct your impact!
              </p>
            </div>
          </section>

          {/* Step 3: Impact Slider */}
          <section className="bg-background rounded-3xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-bold font-heading mb-2 flex items-center">
              <span className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Boost Your Impact
            </h2>
            <p className="text-muted-foreground text-sm mb-6 ml-11">
              Want to give more? You can opt to increase the percentage of your membership fee that goes straight to charity.
            </p>
            <div className="px-11">
              <div className="flex justify-between items-end mb-4">
                <span className="font-bold text-3xl text-primary">{percentage}%</span>
                <span className="text-sm text-muted-foreground font-medium">To Charity</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={percentage} 
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-medium mt-2">
                <span>10% Base</span>
                <span>100% Boost</span>
              </div>
            </div>
          </section>

        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2 animate-in slide-in-from-right-8 duration-700 delay-200">
          <div className="bg-card text-card-foreground rounded-3xl p-8 shadow-xl border border-border sticky top-24">
            <h3 className="text-2xl font-bold font-heading mb-6 border-b border-border pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-muted-foreground">Plan</span>
                <span className="font-bold capitalize">{billing}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-muted-foreground">Membership Fee</span>
                <span className="font-bold">${basePrice.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-border border-dashed">
                <div className="flex justify-between items-center text-primary font-bold">
                  <span>Your Charity Impact</span>
                  <span>${charityAmount}</span>
                </div>
                <div className="text-xs text-muted-foreground text-right mt-1">
                  ({percentage}% of the fee goes to your charity)
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total due today</span>
                <span className="text-3xl font-bold">${basePrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className={cn(buttonVariants({ size: "lg" }), "w-full h-14 rounded-full text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-75 disabled:hover:scale-100")}
            >
              {loading ? 'Processing...' : 'Secure Checkout'}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3" /> Payments process securely via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
