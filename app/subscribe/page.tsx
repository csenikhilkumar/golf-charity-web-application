import { prisma } from '@/lib/prisma'
import { SubscribeFlow } from '@/components/subscription/subscribe-flow'

export const metadata = {
  title: 'Choose Your Subscription | Golf Charity',
}

export default async function SubscribePage() {
  const charities = await prisma.charity.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-muted/20">
      <SubscribeFlow charities={charities} />
    </div>
  )
}
