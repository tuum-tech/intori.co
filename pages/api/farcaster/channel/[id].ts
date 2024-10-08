import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { getChannelDetails } from '../../../../utils/neynarApi'

const getFarcasterChannelDetails = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const channelId = req.query?.id?.toString()

  if (!channelId) {
    return res.status(400).end()
  }

  const details = await getChannelDetails(channelId)

  if (!details) {
    return res.status(404).end()
  }

  // cache for 7 days
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')

  return res.status(200).json(details)
}

export default getFarcasterChannelDetails
