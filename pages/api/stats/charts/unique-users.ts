import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getUniqueUsersOverTime } from '../../../../models/userAnswers'

const getQuestionsOverTimeChart = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const usersOverTime = await getUniqueUsersOverTime({
      startDate: thirtyDaysAgo,
      endDate: today
    })

    res.status(200).json(usersOverTime)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export default getQuestionsOverTimeChart
