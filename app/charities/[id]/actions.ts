'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateUserCharity(userId: string, charityId: string) {
  try {
    // 1. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    // 2. Update the charityId
    await prisma.user.update({
      where: { id: userId },
      data: { charityId }
    })

    // 3. Revalidate affected paths
    revalidatePath('/dashboard')
    revalidatePath(`/charities/${charityId}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating user charity:', error)
    return { error: 'Failed to update charity preference' }
  }
}

export async function getUserCharity(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { charityId: true }
    })
    return { charityId: user?.charityId || null }
  } catch (error) {
    console.error('Error fetching user charity:', error)
    return { charityId: null }
  }
}
