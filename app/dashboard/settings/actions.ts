'use server'

import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function updateProfile(userId: string, data: {
  name?: string
  username?: string
  imageUrl?: string | null
  phone?: string
  address?: string
  city?: string
  country?: string
  charityId?: string
  charityPct?: number
}) {
  console.log('Server: updateProfile called for:', userId)
  console.log('Server: payload size:', JSON.stringify(data).length, 'chars')
  
  try {
    const user = await (prisma as any).user.findUnique({ where: { id: userId } })
    if (!user) {
      console.error('Server: User not found for update:', userId)
      return { error: 'Your account was not found in our database.' }
    }

    if (data.username && data.username !== user.username) {
      const existing = await (prisma as any).user.findUnique({
        where: { username: data.username }
      })
      if (existing && existing.id !== userId) {
        return { error: 'Username already taken' }
      }
    }

    console.log('Server: Executing Prisma update...')
    const updatedUser = await (prisma as any).user.update({
      where: { id: userId },
      data
    })
    console.log('Server: Prisma update success. New name:', updatedUser.name)

    revalidatePath('/', 'layout')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings')
    
    return { success: true, user: updatedUser }
  } catch (error: any) {
    console.error('Server: CRITICAL update error:', error)
    return { error: `Database error: ${error.message}` }
  }
}

export async function updatePassword(email: string, currentPass: string, newPass: string) {
  try {
    // 1. Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPass,
    })

    if (signInError) {
      console.warn('Current password verification failed:', signInError.message)
      return { error: 'Current password is incorrect.' }
    }

    // 2. Update to new password
    const { error: updateError } = await supabase.auth.updateUser({ 
      password: newPass 
    })
    
    if (updateError) throw updateError
    
    return { success: true }
  } catch (error: any) {
    console.error('Password update error:', error)
    return { error: error.message || 'Failed to update password' }
  }
}

export async function getCharities() {
  try {
    const charities = await prisma.charity.findMany({
      orderBy: { name: 'asc' }
    })
    return { success: true, charities }
  } catch (error) {
    return { error: 'Failed to fetch charities' }
  }
}

export async function deleteProfilePic(userId: string) {
  try {
    await (prisma as any).user.update({
      where: { id: userId },
      data: { imageUrl: null }
    })
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete profile picture' }
  }
}
