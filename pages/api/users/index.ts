import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserAnswerTotal } from "@prisma/client"

// models
import { getPageOfTopUserAnswerTotals } from '@/models/userAnswerTotals'
import { countTotalFriends } from '@/models/friendRequests'
import { countGiftsSent } from '@/models/userGift'
import { getPointsTotalForFid } from '@/models/userPointTotals'
import { countRedFlagsLast7Days } from '@/models/RedFlag'
import { getSpamScoreForFid } from "@/models/SpamScore"

export type UserStatsType = {
  id: string
  fid: number
  totalInsights: number
  totalFriends: number
  totalGiftsSent: number
  totalPoints: string
  lastUpdated: number
  totalRedFlags: number
  claimsDisabled: boolean
  spamScore: number
  banned: boolean
}

interface UserStatsResponse {
  items: UserAnswerTotal[];
  nextCursor?: string;
  hasMore: boolean;
}

const getUserStats = async (req: NextApiRequest, res: NextApiResponse<UserStatsResponse>) => {
  try {
    if (req.method !== 'GET') {
      return res.status(404).end()
    }

    const session = await getSession({ req })

    if (!session?.user?.fid || !session?.admin) {
      return res.status(404).end()
    }

    const limit = parseInt(req.query.limit as string) || 10
    const skip = parseInt(req.query.skip as string) ?? 10
    const search = req.query.search as string
    const claimsDisabled = req.query.claimsDisabled === 'true'

    const items = await getPageOfTopUserAnswerTotals({
      limit: limit + 1, // Fetch one extra to determine if there are more
      skip,
      search,
      claimsDisabled
    })

    const hasMore = items.length > limit
    const itemsToReturn = hasMore ? items.slice(0, limit) : items
    const nextCursor = hasMore ? items[limit].id : undefined

    const pageOfItems = await Promise.all(itemsToReturn.map(async (item) => {
      const [
        totalFriends,
        totalGiftsSent,
        totalPoints,
        totalRedFlags,
        spamScore
      ] = await Promise.all([
        countTotalFriends(item.fid),
        countGiftsSent(item.fid),
        getPointsTotalForFid(item.fid),
        countRedFlagsLast7Days(item.fid),
        getSpamScoreForFid(item.fid)
      ])
      return {
        ...item,
        totalInsights: item.count,
        totalFriends,
        totalGiftsSent,
        totalPoints,
        totalRedFlags,
        spamScore: spamScore?.score ?? 0,
        banned: spamScore?.banned ?? false,
        claimsDisabled: spamScore?.preventClaiming ?? false,
      }
    }))

    res.status(200).json({
      items: pageOfItems,
      nextCursor,
      hasMore
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ 
      items: [],
      hasMore: false,
      nextCursor: undefined
    })
  }
}

export default getUserStats
