import { prisma } from "@/prisma"

export const countGiftsSent = async (fid: number): Promise<number> => {
  return prisma.userGift.count({
    where: {
      sentFromFid: fid,
    },
  })
}

export const getGiftsSentOverTime = async (options: {
  startDate: number,
  endDate: number,
}): Promise<Array<{ date: string, giftsSent: number }>> => {
  const { startDate, endDate } = options

  // Convert timestamps to Date objects
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Fetch all user gifts in the date range
  const gifts = await prisma.userGift.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      createdAt: true,
    },
  })

  // Group by day
  const dateGiftMap = new Map<string, number>()
  for (const gift of gifts) {
    const date = gift.createdAt.toISOString().split('T')[0]
    dateGiftMap.set(date, (dateGiftMap.get(date) || 0) + 1)
  }

  // Prepare and sort the result
  const chartData = Array.from(dateGiftMap.entries())
    .map(([date, giftsSent]) => ({ date, giftsSent }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return chartData
}
