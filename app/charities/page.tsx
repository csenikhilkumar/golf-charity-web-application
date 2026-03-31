import { prisma } from "@/lib/prisma"
import { CharityDirectory } from "@/components/charities/charity-directory"

export const metadata = {
  title: 'Charities | Golf Charity Subscription Platform',
  description: 'Browse all of our partnered charities making a difference around the world.'
}

export default async function CharitiesPage() {
  const charities = await prisma.charity.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="w-full">
      <CharityDirectory initialCharities={charities} />
    </div>
  )
}
