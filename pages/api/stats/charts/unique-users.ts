import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getUniqueUsersOverTime } from '../../../../models/userAnswers'
import { subDays } from 'date-fns'
import { CHART_DAYS } from '@/utils/charts'

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

    const endDate = new Date()
    const startDate = subDays(endDate, CHART_DAYS)

    const usersOverTime = await getUniqueUsersOverTime({
      startDate,
      endDate
    })

    res.status(200).json(usersOverTime)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export default getQuestionsOverTimeChart
