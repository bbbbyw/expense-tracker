import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultCategories = [
  { name: 'Food & Dining', color: '#FF6B6B', icon: '🍔' },
  { name: 'Transportation', color: '#4ECDC4', icon: '🚗' },
  { name: 'Shopping', color: '#45B7D1', icon: '🛍️' },
  { name: 'Entertainment', color: '#FFA07A', icon: '🎬' },
  { name: 'Bills & Utilities', color: '#98D8C8', icon: '💡' },
  { name: 'Healthcare', color: '#F7B731', icon: '🏥' },
  { name: 'Education', color: '#5F27CD', icon: '📚' },
  { name: 'Others', color: '#95A5A6', icon: '📌' },
]

async function main() {
  console.log('Seeding default categories...')

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

