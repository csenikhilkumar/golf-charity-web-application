import { PrismaClient, DrawType, DrawStatus, MatchType, WinnerStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Draws and Winners...')

  // 1. Get the first user (for entries/wins)
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log('No user found to seed draws. Run basic seed first.')
    return
  }

  // 2. Create a Published Draw (February)
  const febDraw = await prisma.draw.create({
    data: {
      month: 2,
      year: 2026,
      drawType: 'RANDOM' as DrawType,
      numbers: [4, 12, 19, 32, 41],
      status: 'PUBLISHED' as DrawStatus,
      prizePool: 4500.00,
      publishedAt: new Date(2026, 1, 28)
    }
  })

  // 3. Create a Simulation Draw (March)
  const marDraw = await prisma.draw.create({
    data: {
      month: 3,
      year: 2026,
      drawType: 'ALGORITHMIC' as DrawType,
      numbers: [7, 15, 22, 38, 44],
      status: 'SIMULATION' as DrawStatus,
      prizePool: 5200.00
    }
  })

  // 4. Create Entries for the user (Feb)
  await prisma.drawEntry.create({
    data: {
      drawId: febDraw.id,
      userId: user.id,
      numbers: [4, 12, 19, 33, 42] // 3 matches
    }
  })

  // 5. Create a Winner Record (Feb)
  await prisma.winnerRecord.create({
    data: {
      drawId: febDraw.id,
      userId: user.id,
      matchType: 'THREE_NUMBER' as MatchType,
      prizeAmount: 150.00,
      status: 'PAID' as WinnerStatus,
      createdAt: new Date(2026, 1, 28)
    }
  })

  // 6. Create a Pending Winner (Maybe for a separate user? Let's just use the same one)
  await prisma.winnerRecord.create({
    data: {
      drawId: febDraw.id,
      userId: user.id,
      matchType: 'FOUR_NUMBER' as MatchType,
      prizeAmount: 1200.00,
      status: 'PENDING' as WinnerStatus,
      createdAt: new Date(2026, 2, 15)
    }
  })

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
