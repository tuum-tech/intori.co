import { prisma } from "@/prisma"
import { subDays } from "date-fns"

export const countRedFlags = async (fid: number): Promise<number> => {
  return prisma.redFlag.count({
    where: { fid }
  })
}

export const countRedFlagsLast7Days = async (fid: number): Promise<number> => {
  const sevenDaysAgo = subDays(new Date(), 7)
  
  return prisma.redFlag.count({
    where: { 
      fid,
      createdAt: {
        gte: sevenDaysAgo
      }
    }
  })
}
