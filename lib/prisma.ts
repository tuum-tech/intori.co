// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// In dev, use a global to avoid creating many clients on hot-reload.
// In prod (serverless) it's fine to create per invocation.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // optional: log queries in dev
    // log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
