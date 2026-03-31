import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export const getAdminStats = unstable_cache(
  async () => {
    const [totalUsers, activeSubs, totalCharities, totalRaisedResult] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.charity.count(),
      prisma.winnerRecord.aggregate({
        _sum: { prizeAmount: true }
      })
    ])

    const totalWinnings = totalRaisedResult._sum.prizeAmount || 0
    
    return {
      totalUsers,
      activeSubs,
      totalCharities,
      totalWinnings,
      totalImpact: totalWinnings * 0.25 // Standard logic for platform impact
    }
  },
  ['admin-global-stats'],
  { revalidate: 60, tags: ['admin-stats'] }
)
