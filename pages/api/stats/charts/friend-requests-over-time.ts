import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getFriendRequestsOverTime } from '../../../../models/friendRequests'

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

    const endDate = Date.now()
    const startDate = endDate - (30 * 24 * 60 * 60 * 1000)

    const friendRequestsOverTime = await getFriendRequestsOverTime({
      startDate,
      endDate
    })

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache for 1 hour

    return res.status(200).json(friendRequestsOverTime)
  } catch (error) {
    console.error('Error fetching friend requests over time:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 