import { UserAnswerTotal } from "@prisma/client"
import { prisma } from "@/prisma"

export const getPageOfTopUserAnswerTotals = async (params: {
  limit: number
  skip: number
}): Promise<UserAnswerTotal[]> => {
  return prisma.userAnswerTotal.findMany({
    take: params.limit,
    skip: params.skip,
    orderBy: {
      lastUpdated: "desc"
    }
  })
}

export const countUserAnswerTotals = async (): Promise<number> => {
  return prisma.userAnswerTotal.count()
}
