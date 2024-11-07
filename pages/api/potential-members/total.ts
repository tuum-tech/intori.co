import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { getPotentialChannelMembersTotal } from '../../../models/potentialChannelMember'
import { allowedToEditChannel } from '../../../utils/canEditChannel' 
import { getChannelFrame } from '../../../models/channelFrames'

const getPotentialMembersTotal = async (
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
    const channel = await getChannelFrame(req.query.channelId as string)

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    const allowedToSee = await allowedToEditChannel(fid, channel)

    if (!allowedToSee) {
        return res.status(403).end()
    }

    params.channelId = channel.channelId
  }

  const total = await getPotentialChannelMembersTotal(params)

  return res.status(200).json({ total })
}

export default getPotentialMembersTotal
