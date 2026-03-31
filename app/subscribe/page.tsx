import { prisma } from '@/lib/prisma'
import { SubscribeFlow } from '@/components/subscription/subscribe-flow'
import { Suspense } from 'react'

export const metadata = {
  title: 'Choose Your Subscription | Golf Charity',
}

export default async function SubscribePage() {
  const charities = await prisma.charity.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-muted/20">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-24 max-w-5xl text-center">
          <div className="animate-pulse space-y-8">
            <div className="h-12 w-96 bg-muted rounded mx-auto" />
            <div className="h-4 w-64 bg-muted rounded mx-auto" />
            <div className="grid lg:grid-cols-5 gap-8 mt-12">
              <div className="lg:col-span-3 space-y-8">
                <div className="h-64 bg-muted rounded-3xl" />
                <div className="h-32 bg-muted rounded-3xl" />
              </div>
              <div className="lg:col-span-2">
                <div className="h-96 bg-muted rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      }>
        <SubscribeFlow charities={charities} />
      </Suspense>
    </div>
  )
}
