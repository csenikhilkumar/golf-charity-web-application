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
    }
  ]

  // Clear existing charities to prevent duplicates during re-seeding
  await prisma.charity.deleteMany()

  for (const charity of charities) {
    await prisma.charity.create({
      data: charity
    })
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
