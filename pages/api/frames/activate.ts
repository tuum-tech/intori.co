import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import {
  createFrameErrorUrl,
  createOnboardNoChannelsUrl,
  createOnboardSuccessUrl
} from '../../../utils/urls'
import { getMembershipsOfUser, intoriFollowChannel } from '../../../utils/neynarApi'
import { sendDirectCast } from '../../../utils/sendDirectCast'

// User is activating intori to be added to their channels.
// Intori user will follow the accounts first, then return frame to
// inform user that user must 'invite intori as a member' to channels
const activateIntori = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const validFarcasterPacket = await validateFarcasterPacketMessage(req.body)

  if (!validFarcasterPacket) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const { fid } = await frameSubmissionHelpers(req)

  if (!fid) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const memberships = await getMembershipsOfUser(fid)
  const moderatedChannelIds = (
    memberships
      .filter(m => m.role === 'moderator')
      .map((m) => m.channel.id)
  )


  if (!moderatedChannelIds.length) {
    return res.redirect(
      307,
      createOnboardNoChannelsUrl()
    )
  }

  const directCastMessageParts = [
    `Congrats on activating intori! 🎉`,
    ''
  ]

  for (let i = 0; i < moderatedChannelIds.length; i++) {
    const channelId = moderatedChannelIds[i]


    await intoriFollowChannel(channelId)
    await new Promise((resolve) => setTimeout(resolve, 500)) // rate limited
  }

  const formattedChannelIds = moderatedChannelIds.map((channel) => `/${channel}`).join(', ')

  directCastMessageParts.push(
    `We’ve found that you moderate the following channels: ${formattedChannelIds}, and we’re now following them from the @intori account.`,
  )

  directCastMessageParts.push(...[
    `Next steps: simply send a member request from each of these channels to @intori, and you're all set! Once we receive the requests, we’ll automatically accept them, and your channels will start receiving:`,
    '',
    `👉 Introduction question frame`,
    `👉 Tracking of potential members`,
    `👉 Channel stats`,
    `👉 Branded insights frame generator`,
    '',
    `Looking forward to seeing your community grow with intori!`,
    '',
    `intori Team`,
  ])

  await sendDirectCast({
    recipientFid: fid,
    message: directCastMessageParts.join('\n'),
  })

  return res.redirect(
    307,
    createOnboardSuccessUrl()
  )
}

export default activateIntori
