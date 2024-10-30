import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { allowedToEditChannel } from '../../../../utils/canEditChannel' 
import { getMembersOfChannel, doesUserFollowUser } from '../../../../utils/neynarApi' 
import { getChannelFrame } from '../../../../models/channelFrames'

// Get if any members or moderators follow this potential member
const getRelevantFollowers = async (
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
    return res.status(404).json({
      error: 'Channel ID is required'
    })
  }

  const channelId = req.query.channelId as string
  const channelFrame = await getChannelFrame(channelId)

  if (!channelFrame) {
    return res.status(404).json({
      error: 'Channel has not joined intori'
    })
  }

  const fid = parseInt(session.user.fid, 10)
  const canSeeThis = await allowedToEditChannel(fid, channelFrame)

  if (!canSeeThis) {
    return res.status(403).end()
  }

  const membersOfChannel = await getMembersOfChannel({ channelId })
  const memberFollowers: Array<{ fid: number, role: 'member' | 'moderator' }> = []

  console.log('membersOfChannel', membersOfChannel.length)
  for (let i = 0; i < membersOfChannel.length; i++) {
    const memberFollowsPotentialMember = await doesUserFollowUser(
      membersOfChannel[i].user.fid,
      fid
    )

    if (memberFollowsPotentialMember) {
      memberFollowers.push({
        fid: membersOfChannel[i].user.fid,
        role: membersOfChannel[i].role
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return res.status(200).json(memberFollowers)
}

export default getPotentialMemberMemberFollowers
