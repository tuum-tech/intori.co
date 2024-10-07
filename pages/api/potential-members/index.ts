import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { getAllChannelFrames } from '../../../models/channelFrames'
import { getPotentialChannelMembers } from '../../../models/potentialChannelMember'

const getPotentialMembers = async (
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

  const fid = parseInt(session.user.fid, 10)
  const params: { channelId?: string } = {}

  if (req.query.channelId) {
    params.channelId = String(req.query.channelId)

    if (!session.admin) {
      const channelsIOwn = await getAllChannelFrames({ adminFid: fid })
      const channelIdIsMine = channelsIOwn.some(
        (channel) => channel.channelId === params.channelId
      )
      if (!channelIdIsMine) {
        return res.status(403).end()
      }
    }
  }

  const potentialChannelMembers = await getPotentialChannelMembers(params)

  return res.status(200).json(potentialChannelMembers)
}

export default getPotentialMembers
