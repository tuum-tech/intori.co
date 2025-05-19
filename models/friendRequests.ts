import { FriendRequestStatus } from "@prisma/client"
import { prisma } from "@/prisma"

export const countTotalFriends = async (fid: number): Promise<number> => {
  return prisma.friendRequest.count({
    where: {
      AND: [
        { fromFid: fid, status: FriendRequestStatus.accepted },
        { toFid: fid, status: FriendRequestStatus.accepted },
      ]
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

  // Fetch all friend requests in the date range
  const requests = await prisma.friendRequest.findMany({
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
