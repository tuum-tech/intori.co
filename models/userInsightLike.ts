import { prisma } from "@/prisma"

export const getInsightLikesOverTime = async (options: {
  startDate: number,
  endDate: number,
}): Promise<Array<{ date: string, insightLikes: number }>> => {
  const { startDate, endDate } = options

  // Convert timestamps to Date objects
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Fetch all user insight likes in the date range
  const likes = await prisma.userInsightLike.findMany({
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
  const dateRequestMap = new Map<string, number>()
  for (const like of likes) {
    const date = like.createdAt.toISOString().split('T')[0]
    dateRequestMap.set(date, (dateRequestMap.get(date) || 0) + 1)
  }

  // Prepare and sort the result
  const chartData = Array.from(dateRequestMap.entries())
    .map(([date, insightLikes]) => ({ date, insightLikes }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return chartData
}
