import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "@/prisma"

const getGeneralStats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(404).end()
    }
    const session = await getSession({ req })

    if (!session?.user?.fid) {
      return res.status(404).end()
    }

    if (!session.admin) {
      return res.status(404).end()
    }

    const latestStats = await prisma.dailyStats.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        uniqueUsers: true,
        questionsAnswered: true,
        pendingFriendRequests: true,
        acceptedFriendRequests: true
      }
    })

    if (!latestStats) {
      res.status(200).json({
          uniqueUsersCount: 0,
          totalResponses: 0,
          pendingFriends: 0,
          acceptedFriends: 0
      })
      return
    }

    res.status(200).json({
        uniqueUsersCount: latestStats.uniqueUsers,
        totalResponses: latestStats.questionsAnswered,
        pendingFriends: latestStats.pendingFriendRequests,
        acceptedFriends: latestStats.acceptedFriendRequests
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export default getGeneralStats
