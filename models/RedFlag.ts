import { prisma } from "@/prisma"

export const countRedFlags = async (fid: number): Promise<number> => {
  return prisma.redFlag.count({
    where: { fid }
  })
}
