import { prisma } from "@/prisma"

export const getPointsTotalForFid = async (fid: number): Promise<string> => {
  const total = await prisma.userPointTotals.findFirst({
    where: { fid }
  })

  if (!total) {
    return "0"
  }

  return total.bigIntPoints.toString()
}
