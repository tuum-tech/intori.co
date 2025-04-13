import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getGiftsSentOverTime } from '../../../../models/userGift'
import { subDays } from 'date-fns'

const getGiftsOverTime = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(404).end()
    }

    const session = await getSession({ req })

    if (!session?.user?.fid || !session?.admin) {
      return res.status(404).end()
    }

    const days = parseInt(req.query.days as string) || 30
    const endDate = Date.now()
    const startDate = subDays(endDate, days).getTime()

    const data = await getGiftsSentOverTime({
      startDate,
      endDate
    })

    // cache for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable')

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch gifts over time' })
  }
}

export default getGiftsOverTime
