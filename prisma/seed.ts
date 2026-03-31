import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding charities...')

  const charities = [
    {
      name: 'The First Tee',
      description: 'Impacting the lives of young people by providing educational programs that build character and instill life-enhancing values through the game of golf.',
      imageUrl: 'https://images.unsplash.com/photo-1535136104956-613d940c6198?auto=format&fit=crop&q=80',
      website: 'https://firsttee.org/',
      featured: true,
    },
    {
      name: 'Save the Children',
      description: 'Giving children a healthy start in life, the opportunity to learn and protection from harm.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80',
      website: 'https://www.savethechildren.org/',
      featured: true,
    },
    {
      name: 'World Wildlife Fund',
      description: 'Conserving nature and reducing the most pressing threats to the diversity of life on Earth.',
      imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80',
      website: 'https://www.worldwildlife.org/',
      featured: false,
    },
    {
      name: 'Water.org',
      description: 'Bringing safe water and sanitation to the world through access to small, affordable loans.',
      imageUrl: 'https://images.unsplash.com/photo-1463171515643-952cee54d42a?auto=format&fit=crop&q=80',
      website: 'https://water.org/',
      featured: false,
    },
    {
      name: 'American Red Cross',
      description: 'Preventing and alleviating human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors.',
      imageUrl: 'https://images.unsplash.com/photo-1594241088461-127e997f37f3?auto=format&fit=crop&q=80',
      website: 'https://www.redcross.org/',
      featured: false,
    },
    {
      name: 'Feeding America',
      description: 'A nationwide network of food banks that feeds more than 46 million people through food pantries, soup kitchens, and shelters.',
      imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80',
      website: 'https://www.feedingamerica.org/',
      featured: false,
    },
    {
      name: 'Doctors Without Borders',
      description: 'Providing medical care where it is needed most—in armed conflicts, epidemics, and natural disasters around the world.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80',
      website: 'https://www.doctorswithoutborders.org/',
      featured: false,
    },
    {
      name: 'The Nature Conservancy',
      description: 'Conserving the lands and waters on which all life depends to tackle climate change and protect biodiversity.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80',
      website: 'https://www.nature.org/',
      featured: false,
    },
    {
      name: 'Malala Fund',
      description: 'Working for a world where every girl can learn and lead without fear or discrimination.',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?auto=format&fit=crop&q=80',
      website: 'https://malala.org/',
      featured: false,
    },
    {
      name: 'Ocean Conservancy',
      description: 'Working to protect the ocean from today’s greatest global challenges through science-based solutions and advocacy.',
      imageUrl: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&q=80',
      website: 'https://oceanconservancy.org/',
      featured: false,
    }
  ]

  for (const charity of charities) {
    // Look up by name to avoid duplicates and preserve existing IDs
    const existing = await prisma.charity.findFirst({
      where: { name: charity.name }
    })

    if (existing) {
      await prisma.charity.update({
        where: { id: existing.id },
        data: charity
      })
    } else {
      await prisma.charity.create({
        data: charity
      })
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
