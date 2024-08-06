import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getUniqueUserFids, countUserResponses } from '../../../models/userAnswers'

const getQuestionsOverTimeChart = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(404).end()
    }
    const session = await getSession({ req })
    const channelId = req.query.channelId as string

    if (!session?.user?.fid) {
      return res.status(404).end()
    }

    if (!session.admin && !session.channelAdmin?.length) {
      return res.status(404).end()
    }

    if (!channelId && !session.admin) {
      return res.status(404).end()
    }

    if (channelId) {
      const channelsImAdminOf = session.channelAdmin.map((channel) => channel.channelId)

      if (!session.admin && !channelsImAdminOf.includes(channelId.toString())) {
        return res.status(404).end()
      }
    }

    const uniqueUsersCount = await getUniqueUserFids(channelId)
    const totalResponses = await countUserResponses(channelId)

    res.status(200).json({
        uniqueUsersCount,
        totalResponses
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export default getQuestionsOverTimeChart
