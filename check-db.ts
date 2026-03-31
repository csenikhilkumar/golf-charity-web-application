import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const tableInfo = await prisma.$queryRaw`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'User'
  `
  console.log('User Table Columns:', tableInfo)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
