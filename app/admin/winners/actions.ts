'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { WinnerStatus } from '@prisma/client'

export async function updateWinnerStatus(winningId: string, status: WinnerStatus) {
  try {
    const record = await prisma.winnerRecord.findUnique({
      where: { id: winningId }
    })

    if (!record) {
      return { error: 'Record not found' }
    }

    await prisma.winnerRecord.update({
      where: { id: winningId },
      data: { status }
    })

    revalidatePath('/admin/winners')
    revalidatePath('/admin')
    revalidatePath('/dashboard/winnings') // Revalidate subscriber side too
    
    return { success: true }
  } catch (err) {
    console.error('Error updating winner status:', err)
    return { error: 'An unexpected error occurred while updating status.' }
  }
}
