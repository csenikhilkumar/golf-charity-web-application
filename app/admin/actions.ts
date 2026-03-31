'use server'

import { prisma } from '@/lib/prisma'

export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    return user?.role === 'ADMIN'
  } catch {
    return false
  }
}
