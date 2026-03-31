'use server'

import { prisma } from '@/lib/prisma'
import { DrawEngine } from '@/lib/draw-engine'
import { revalidatePath } from 'next/cache'

/**
 * Simulates a draw for the current month.
 * Calculates prize pool and identifies potential winners.
 */
export async function simulateDraw(month: number, year: number, type: 'RANDOM' | 'ALGORITHMIC' = 'RANDOM') {
  try {
    const prizePool = await DrawEngine.calculatePrizePool(month, year)
    const winningNumbers = type === 'RANDOM' 
      ? DrawEngine.generateNumbers() 
      : await DrawEngine.runAlgorithmicSimulation(month, year)

    // We need a temporary draw ID to fetch entries (or just pass the criteria)
    // For simulation, we create a draft draw or handle it in memory
    const tempDraw = await prisma.draw.create({
      data: {
        month,
        year,
        drawType: type,
        numbers: winningNumbers,
        prizePool,
        status: 'SIMULATION'
      }
    })

    const winners = await DrawEngine.processWinners(tempDraw.id, winningNumbers, prizePool)
    
    return {
      success: true,
      draw: tempDraw,
      winners,
      prizePool
    }
  } catch (error) {
    console.error('Error simulating draw:', error)
    return { success: false, error: 'Simulation failed' }
  }
}

import { sendEmail } from '@/lib/email'
import { WinnerAlertEmail } from '@/emails/winner-alert'
import { DrawResultsEmail } from '@/emails/draw-results'

/**
 * Publishes a draw, finalizing the results and creating WinnerRecords.
 */
export async function publishDraw(drawId: string, winners: any[]) {
  try {
    const draw = await prisma.draw.findUnique({ 
      where: { id: drawId },
      include: { entries: true }
    })
    if (!draw) throw new Error('Draw not found')

    // 1. Update draw status
    await prisma.draw.update({
      where: { id: drawId },
      data: { 
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    })

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const drawMonth = monthNames[draw.month - 1];

    // 2. Create winner records and send individual alerts
    for (const winner of winners) {
      await prisma.winnerRecord.create({
        data: {
          drawId,
          userId: winner.userId,
          matchType: winner.matchType,
          prizeAmount: winner.prizeAmount,
          status: 'PENDING'
        }
      })

      // Fetch user email for notification
      const user = await prisma.user.findUnique({ where: { id: winner.userId } })
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: '🏆 You won a prize in the Golf Charity Draw!',
          react: WinnerAlertEmail({
            userName: user.name || 'Subscriber',
            prizeAmount: winner.prizeAmount,
            matchType: winner.matchType,
            drawDate: `${drawMonth} ${draw.year}`
          })
        })
      }
      // Create In-App Notification for winner
      await prisma.notification.create({
        data: {
          userId: winner.userId,
          title: '🏆 You won a prize!',
          message: `Congratulations! You won $${winner.prizeAmount.toFixed(0)} in the ${drawMonth} draw.`,
          type: 'WINNER'
        }
      })
    }

    // 3. Send general draw results to all active subscribers
    const activeSubscribers = await prisma.user.findMany({
      where: {
        subscription: {
          status: 'ACTIVE'
        }
      },
      select: { id: true, email: true }
    })

    const subscriberEmails = activeSubscribers.map(s => s.email)
    const subscriberIds = activeSubscribers.map(s => s.id)
    
    if (subscriberEmails.length > 0) {
      await sendEmail({
        to: subscriberEmails,
        subject: `🎯 ${drawMonth} ${draw.year} Draw Results are in!`,
        react: DrawResultsEmail({
          month: drawMonth,
          year: draw.year,
          winningNumbers: draw.numbers,
          prizePool: draw.prizePool,
          totalWinners: winners.length
        })
      })

      // Create general in-app notifications
      await prisma.notification.createMany({
        data: subscriberIds.map(id => ({
          userId: id,
          title: `🎯 ${drawMonth} Draw Results`,
          message: `The ${drawMonth} draw results have been published. Check to see if you matched!`,
          type: 'DRAW'
        }))
      })
    }

    revalidatePath('/')
    revalidatePath('/admin/draws')
    revalidatePath('/winners')
    
    return { success: true }
  } catch (error) {
    console.error('Error publishing draw:', error)
    return { success: false, error: 'Publishing failed' }
  }
}

/**
 * Deletes a simulation draw.
 */
export async function deleteSimulation(drawId: string) {
  try {
    await prisma.draw.delete({ where: { id: drawId } })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Deletion failed' }
  }
}
