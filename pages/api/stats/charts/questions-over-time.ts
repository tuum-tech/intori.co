import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getQuestionsAnsweredOverTime } from '../../../../models/userAnswers'

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

    if (!channelId && !session.admin) {
      return res.status(404).end()
    }

    if (channelId) {
      // TODO: check if getting stats about a channel i am admin for
    }

    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const questionsAnsweredOverTime = await getQuestionsAnsweredOverTime({
      startDate: thirtyDaysAgo,
      endDate: today,
      channelId
    })

    res.status(200).json({
        questionsAnsweredOverTime
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export default getQuestionsOverTimeChart
