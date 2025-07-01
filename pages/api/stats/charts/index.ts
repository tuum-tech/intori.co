import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/prisma'
import { subDays } from 'date-fns'
import { CHART_DAYS } from '@/utils/charts'

export default async function getFriendRequestsOverTimeHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    if (!session?.admin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const endDate = new Date()
    const startDate = subDays(endDate, CHART_DAYS)

    const stats = await prisma.dailyStats.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
    })

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache for 1 hour

    return res.status(200).json(stats)
  } catch (error) {
    console.error('Error fetching friend requests over time:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
