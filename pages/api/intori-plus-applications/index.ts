import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/prisma'
import { IntoriPlusApplication } from '@prisma/client';

const getIntoriPlusApplications = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const session = await getSession({ req })

    if (!session?.user?.fid || !session?.admin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const limit = parseInt(req.query.limit as string) || 10
    const skip = parseInt(req.query.skip as string) || 0

    const items = await prisma.intoriPlusApplication.findMany({
      take: limit + 1, // Fetch one extra to determine if there are more
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const hasMore = items.length > limit
    const itemsToReturn = hasMore ? items.slice(0, limit) : items
    const nextCursor = hasMore ? items[limit].id : undefined

    res.status(200).json({
      items: itemsToReturn,
      nextCursor,
      hasMore
    })
  } catch (error) {
    console.error('Error fetching Intori Plus applications:', error)
    res.status(500).json({ 
      items: [],
      hasMore: false,
      nextCursor: undefined
    })
  }
}

export default getIntoriPlusApplications
