import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma: PrismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query"],        // Logs queries to the console (optional)
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
