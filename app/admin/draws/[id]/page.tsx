import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DrawView from './view'
import { DrawEngine } from '@/lib/draw-engine'

export default async function DrawDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const draw = await prisma.draw.findUnique({
    where: { id },
    include: {
      winners: true,
      _count: {
        select: { entries: true }
      }
    }
  })

  if (!draw) {
    notFound()
  }

  // If simulation, we re-run the processor to get the potential winners
  // since they aren't persisted in WinnerRecord for simulations.
  let winners = []
  if (draw.status === 'PUBLISHED') {
    winners = draw.winners
  } else {
    winners = await DrawEngine.processWinners(draw.id, draw.numbers, draw.prizePool)
  }

  return <DrawView draw={draw} winners={winners} />
}
