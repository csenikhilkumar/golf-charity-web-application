'use server'

import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { SystemUpdateEmail } from '@/emails/system-update'
import { revalidatePath } from 'next/cache'

export async function broadcastUpdate(title: string, content: string) {
  try {
    // 0. Validation
    if (!title.trim() || title.length < 5) return { success: false, error: 'Title must be at least 5 characters.' }
    if (!content.trim() || content.length < 10) return { success: false, error: 'Content must be at least 10 characters.' }

    // 1. Fetch all subscribers
    const subscribers = await prisma.user.findMany({
      where: {
        subscription: {
          status: 'ACTIVE'
        }
      },
      select: { id: true, email: true }
    })

    const emails = subscribers.map(s => s.email)

    if (emails.length === 0) {
      return { success: true, count: 0 }
    }

    // 2. Send emails and create in-app notifications in batches
    const batchSize = 50
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const batchEmails = batch.map(s => s.email)
      
      // Send Emails
      const emailRes = await sendEmail({
        to: batchEmails,
        subject: `📢 Update: ${title}`,
        react: SystemUpdateEmail({ title, content })
      })

      if (!emailRes.success) {
        throw new Error(typeof emailRes.error === 'string' ? emailRes.error : 'Email delivery failed')
      }

      // Create In-App Notifications
      await prisma.notification.createMany({
        data: batch.map(s => ({
          userId: s.id,
          title: `📢 Update: ${title}`,
          message: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
          type: 'COMMUNITY'
        }))
      })
    }

    revalidatePath('/') // Revalidate all for notification bell
    return { success: true, count: subscribers.length }
  } catch (error) {
    console.error('Broadcast failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send broadcast emails' }
  }
}
