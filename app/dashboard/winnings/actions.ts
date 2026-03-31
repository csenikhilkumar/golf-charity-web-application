'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getUserWinnings(userId: string) {
  try {
    const winnings = await prisma.winnerRecord.findMany({
      where: { userId },
      include: {
        draw: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { winnings }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to retrieve winnings' }
  }
}

export async function submitWinnerProof(winningId: string, proofUrl: string, userId: string) {
  try {
    if (!proofUrl || !proofUrl.startsWith('http')) {
      return { error: 'Please submit a valid URL to your proof image/document.' }
    }

    // Verify ownership
    const record = await prisma.winnerRecord.findUnique({
      where: { id: winningId }
    })

    if (!record || record.userId !== userId) {
      return { error: 'Unauthorized or record not found.' }
    }

    if (record.status !== 'PENDING') {
      return { error: 'This record has already been processed.' }
    }

    await prisma.winnerRecord.update({
      where: { id: winningId },
      data: {
        proofUrl,
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/winnings')
    
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'An unexpected error occurred.' }
  }
}
