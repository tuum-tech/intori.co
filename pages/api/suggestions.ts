import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getAllSuggestedUSersAndChannels } from '../../utils/frames/suggestions'

const getSuggestions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const session = await getSession({ req })

  if (!session?.user?.fid) {
    return res.status(401).end()
  }

  const suggestions = await getAllSuggestedUSersAndChannels({
    fid: parseInt(session.user.fid, 10)
  })

  // cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

  res.status(200).json(suggestions)
}

export default getSuggestions
