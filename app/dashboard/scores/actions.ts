'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitScore(userId: string, value: number, datePlayed: string) {
  try {
    if (value < 1 || value > 45) {
      return { error: 'Stableford scores must be between 1 and 45.' }
    }

    const date = new Date(datePlayed)
    if (isNaN(date.getTime())) {
      return { error: 'Invalid date format.' }
    }
    if (date > new Date()) {
      return { error: 'You cannot log a score for a future date.' }
    }
    
    // "Rolling 5" auto-replace backend logic:
    // User can only have a maximum of 5 most recent scores mapped to them for draw calculation.
    // We keep exactly 5.
    
    const existingScores = await prisma.score.findMany({
      where: { userId },
      orderBy: [
        { datePlayed: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    if (existingScores.length >= 5) {
      const scoresToDelete = existingScores.slice(4)
      for (const oldScore of scoresToDelete) {
        await prisma.score.delete({ where: { id: oldScore.id } })
      }
    }

    await prisma.score.create({
      data: {
        userId,
        value,
        datePlayed: date,
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/scores')
    
    return { success: true }
  } catch (error) {
    console.error('Error submitting score:', error)
    return { error: 'Failed to submit score. Please try again later.' }
  }
}

export async function getScoresHistory(userId: string) {
  try {
    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: [
        { datePlayed: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    return { scores }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to retrieve score history' }
  }
}

export async function deleteScore(scoreId: string, userId: string) {
  try {
    const score = await prisma.score.findUnique({ where: { id: scoreId } })
    if (!score || score.userId !== userId) {
      return { error: 'Unauthorized or not found' }
    }
    await prisma.score.delete({ where: { id: scoreId } })
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/scores')
    return { success: true }
  } catch (error) {
    console.error('Error deleting score', error)
    return { error: 'Failed to delete score' }
  }
}
