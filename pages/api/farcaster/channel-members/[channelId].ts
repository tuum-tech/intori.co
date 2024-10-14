import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { getMembersOfChannel } from '../../../../utils/neynarApi'

const getChannelMembers = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session?.user?.fid) {
    return res.status(403).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  if (!req.query.channelId) {
    return res.status(400).json({
      error: "Missing 'channelId' query parameter"
    })
  }
  const members = await getMembersOfChannel({
    channelId: req.query.channelId as string
  })

  // cache for 7 days
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')

  return res.status(200).json(members)
}

export default getChannelMembers
