import { prisma } from "@/prisma"
import { chunkArray } from '@/utils/chunkArray'

export const getInsightLikesOverTime = async (options: {
  startDate: number,
  endDate: number,
}): Promise<Array<{ date: string, insightLikes: number }>> => {
  const { startDate, endDate } = options

  // Convert timestamps to Date objects
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Split the date range into 30-day chunks
  const days: Date[] = []
  let d = new Date(start)
  while (d <= end) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  const dayChunks = chunkArray(days, 30)

  let likes: { id: string, createdAt: Date }[] = []
  const PAGE_SIZE = 1000;
  for (const chunk of dayChunks) {
    const chunkStart = chunk[0]
    const chunkEnd = chunk[chunk.length - 1]
    let hasMore = true;
    let cursor: string | undefined = undefined;
    while (hasMore) {
      const chunkLikes: { id: string, createdAt: Date }[] = await prisma.userInsightLike.findMany({
        where: {
          createdAt: {
            gte: chunkStart,
            lte: chunkEnd,
          },
        },
        select: {
          id: true,
          createdAt: true,
        },
        take: PAGE_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { id: 'asc' },
      });
      likes = likes.concat(chunkLikes);
      if (chunkLikes.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        cursor = chunkLikes[chunkLikes.length - 1].id;
      }
    }
  }

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
