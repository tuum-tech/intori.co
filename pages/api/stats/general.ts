import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { countTotalUserAnswers } from '../../../models/userAnswers'
import { countUserAnswerTotals } from '../../../models/userAnswerTotals'
import {
  countPendingFriendRequests,
  countAcceptedFriendRequests
} from '../../../models/friendRequests'

const getGeneralStats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(404).end()
    }
    const session = await getSession({ req })
    const channelId = req.query.channelId as string

    if (!session?.user?.fid) {
      return res.status(404).end()
    }

    if (!channelId && !session.admin) {
      return res.status(404).end()
    }

    const uniqueUsersCount = await countUserAnswerTotals()
    const totalResponses = await countTotalUserAnswers()
    const pendingFriends = await countPendingFriendRequests()
    const acceptedFriends = await countAcceptedFriendRequests()

    res.status(200).json({
        uniqueUsersCount,
        totalResponses,
        pendingFriends,
        acceptedFriends
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export default getGeneralStats
