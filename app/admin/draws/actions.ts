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

/**
 * Publishes a draw, finalizing the results and creating WinnerRecords.
 */
export async function publishDraw(drawId: string, winners: any[]) {
  try {
    const draw = await prisma.draw.findUnique({ where: { id: drawId } })
    if (!draw) throw new Error('Draw not found')

    // 1. Update draw status
    await prisma.draw.update({
      where: { id: drawId },
      data: { 
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    })

    // 2. Create winner records
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
    }

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
