import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Updating First Tee image...')
  const result = await prisma.charity.updateMany({
    where: { name: 'The First Tee' },
    data: { imageUrl: 'https://images.unsplash.com/photo-1535136104956-613d940c6198?auto=format&fit=crop&q=80' }
  })
  console.log('Update result:', result)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
