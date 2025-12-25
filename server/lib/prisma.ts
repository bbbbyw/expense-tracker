import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// In serverless environments, don't cache Prisma client globally
// Each function invocation should use a fresh instance if needed
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  globalForPrisma.prisma = prisma
}

