'use server'

import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia',
})

export async function getDashboardData(userId: string, email?: string, name?: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        charity: true,
        scores: {
          orderBy: [
            { datePlayed: 'desc' },
            { createdAt: 'desc' }
          ],
          take: 5
        },
        winnings: {
          include: { draw: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { drawEntries: true }
        }
      }
    })

    if (!user && email) {
      // Auto-sync missing Prisma user from Supabase Auth
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name: name || 'Golfer',
        },
        include: {
          subscription: true,
          charity: true,
          scores: true,
          winnings: {
            include: { draw: true }
          },
          _count: {
            select: { drawEntries: true }
          }
        }
      })
    }

    if (!user) return { error: 'User not found in database' }

    const totalWonAgg = await prisma.winnerRecord.aggregate({
      where: { userId: user.id },
      _sum: { prizeAmount: true }
    })
    const totalWon = totalWonAgg._sum.prizeAmount || 0

    return { 
      user, 
      stats: {
        totalWon,
        participationCount: user._count.drawEntries
      }
    }
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)
    return { error: 'Failed to retrieve data' }
  }
}

export async function syncStripeSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (!session || session.payment_status !== 'paid') return { success: false }

    const userId = session.metadata?.userId
    const charityId = session.metadata?.charityId
    const charityPct = Number(session.metadata?.charityContributionPercentage || 10)

    if (userId && charityId) {
      await prisma.user.update({
        where: { id: userId },
        data: { charityId, charityPct }
      })
    }

    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const isYearly = subscription.items.data[0].price.recurring?.interval === 'year'

      await prisma.subscription.upsert({
        where: { userId: userId as string },
        create: {
          userId: userId as string,
          plan: isYearly ? 'YEARLY' : 'MONTHLY',
          status: 'ACTIVE',
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
        },
        update: {
          plan: isYearly ? 'YEARLY' : 'MONTHLY',
          status: 'ACTIVE',
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
        }
      })
    }
    return { success: true }
  } catch (error) {
    console.error('Error syncing Stripe session manually:', error)
    return { success: false }
  }
}
