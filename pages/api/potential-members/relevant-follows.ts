
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { getRelevantFollows } from '../../../models/potentialChannelMemberRelevantFollows'
import { allowedToEditChannel } from '../../../utils/canEditChannel' 
import { getChannelFrame } from '../../../models/channelFrames'

const getPotentialMemberRelevantFollows = async (
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

  const { channelId, potentialMemberFid } = req.query

  if (!channelId) {
    return res.status(400).json({
      error: 'Channel ID is required'
    })
  }

  if (!potentialMemberFid) {
    return res.status(400).json({
      error: 'Potential member fid is required'
    })
  }

  const params = {
    channelId: channelId as string,
    potentialMemberFid: parseInt(potentialMemberFid as string, 10)
  }

  const channelFrame = await getChannelFrame(params.channelId)

  if (!channelFrame) {
    return res.status(400).json({
      error: 'Channel frame not found in intori'
    })
  }

  const fid = parseInt(session.user.fid, 10)

  const allowedToView = await allowedToEditChannel(fid, channelFrame)

  if (!allowedToView) {
    return res.status(403).end()
  }

  const relevantFollows = await getRelevantFollows(params)

  return res.status(200).json(relevantFollows)
}

export default getPotentialMemberRelevantFollows
