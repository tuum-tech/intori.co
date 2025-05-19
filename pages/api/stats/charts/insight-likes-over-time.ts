import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getInsightLikesOverTime } from '../../../../models/userInsightLike'
import { subDays } from 'date-fns'
import { CHART_DAYS } from '@/utils/charts'

export default async function getInsightLikesOverTimeHandler(
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

    const endDate = Date.now()
    const startDate = subDays(endDate, CHART_DAYS).getTime()

    const insightLikesOverTime = await getInsightLikesOverTime({
      startDate,
      endDate,
    })

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache for 1 hour

    return res.status(200).json(insightLikesOverTime)
  } catch (error) {
    console.error('Error fetching insight likes over time:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
