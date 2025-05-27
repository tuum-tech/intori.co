import { FriendRequestStatus } from "@prisma/client"
import { prisma } from "@/prisma"
import { chunkArray } from '@/utils/chunkArray'

export const countTotalFriends = async (fid: number): Promise<number> => {
  return prisma.friendRequest.count({
    where: {
      OR: [
        { fromFid: fid, status: FriendRequestStatus.accepted },
        { toFid: fid, status: FriendRequestStatus.accepted },
      ]
    }
  })
}

export const countPendingFriendRequests = async (): Promise<number> => {
  return prisma.friendRequest.count({
    where: {
      status: 'pending'
    }
  })
}

export const countAcceptedFriendRequests = async (): Promise<number> => {
  return prisma.friendRequest.count({
    where: {
      status: 'accepted'
    }
  })
}

export const getFriendRequestsOverTime = async (options: {
  startDate: number,
  endDate: number,
}): Promise<Array<{ date: string, friendRequests: number }>> => {
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

  let requests: { id: string, createdAt: Date }[] = []
  const PAGE_SIZE = 1000;
  for (const chunk of dayChunks) {
    const chunkStart = chunk[0]
    const chunkEnd = chunk[chunk.length - 1]
    let hasMore = true;
    let cursor: string | undefined = undefined;
    while (hasMore) {
      const chunkRequests: { id: string, createdAt: Date }[] = await prisma.friendRequest.findMany({
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
      requests = requests.concat(chunkRequests);
      if (chunkRequests.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        cursor = chunkRequests[chunkRequests.length - 1].id;
      }
    }
  }

  // Group by day
  const dateRequestMap = new Map<string, number>()
  for (const req of requests) {
    const date = req.createdAt.toISOString().split('T')[0]
    dateRequestMap.set(date, (dateRequestMap.get(date) || 0) + 1)
  }

  // Prepare and sort the result
  const chartData = Array.from(dateRequestMap.entries())
    .map(([date, friendRequests]) => ({ date, friendRequests }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return chartData
}
