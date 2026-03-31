const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- Starting Admin Upgrade ---')
  
  const emails = ['nikhil07407@gmail.com', 'nk7603353@gmail.com']
  
  for (const email of emails) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      console.log(`Found user: ${email} | Current Role: ${user.role}`)
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      })
      console.log(`Updated user: ${email} to ADMIN`)
    } else {
      console.log(`User not found: ${email}`)
    }
  }

  const finalCheck = await prisma.user.findMany()
  console.log('Final Verification:')
  finalCheck.forEach(u => console.log(`- ${u.email}: ${u.role}`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
