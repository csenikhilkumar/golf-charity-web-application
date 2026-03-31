import { PrismaClient, MatchType, WinnerStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst()
  const draw = await prisma.draw.findFirst({ where: { status: 'PUBLISHED' } })

  if (!user || !draw) {
    console.error('No users or published draws found to seed winners for.')
    return
  }

  const winners = [
    {
      drawId: draw.id,
      userId: user.id,
      matchType: MatchType.THREE_NUMBER,
      prizeAmount: 250.00,
      status: WinnerStatus.PENDING,
      proofUrl: 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?q=80&w=800'
    },
    {
      drawId: draw.id,
      userId: user.id,
      matchType: MatchType.FOUR_NUMBER,
      prizeAmount: 750.00,
      status: WinnerStatus.APPROVED,
      proofUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800'
    }
  ]

  for (const w of winners) {
    await prisma.winnerRecord.create({
      data: w
    })
  }

  console.log('Seeded winner records successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
