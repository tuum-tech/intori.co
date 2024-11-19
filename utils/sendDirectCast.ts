import axios, { isAxiosError } from 'axios'
import { v4 as uuid } from 'uuid'
import { ChannelFrameType } from '../models/channelFrames'
import { getSavedMembersOfChannel } from '../models/channelMembers'

const WARPCAST_API_KEY = process.env.WARPCAST_API_KEY

export const sendDirectCast = async (params: {
  recipientFid: number
  message: string
}): Promise<void> => {
  await axios.put(
    "https://api.warpcast.com/v2/ext-send-direct-cast",
    {
      ...params,
      idempotencyKey: uuid()
    },
    {
      headers: {
        Authorization: `Bearer ${WARPCAST_API_KEY}`
      },
    }
  )
}

export const notifySuperAdminOfError = async (error: unknown, where: string): Promise<void> => {
  const superAdminFids = (
    process.env.SUPER_ADMIN_FIDS ?? ''
  ).split(',').map((fid) => parseInt(fid, 10))

  if (isAxiosError(error) && error.response) {
    const { status, statusText, data } = error.response

    await Promise.all(
      superAdminFids.map((fid) => sendDirectCast({
        recipientFid: fid,
        message: `${where} Error: ${error?.config?.url} ${status} ${statusText} ${JSON.stringify(data)}`
      }))
    )

    return
  }

  await Promise.all(
    superAdminFids.map((fid) => sendDirectCast({
      recipientFid: fid,
      message: `${where} Error: ${(error as Error)?.message}`
    }))
  )
}

export const notifyOwnerAndModeratorsOfChannelIntoriAdded = async (newChannelFrame: ChannelFrameType): Promise<void> => {
  const moderators = await getSavedMembersOfChannel({
    channelId: newChannelFrame.channelId,
    role: 'moderator'
  })

  const fidsToNotify = moderators.map((mod) => mod.fid)

  for (let i = 0; i < fidsToNotify.length; i++) {
    const fid = fidsToNotify[i]

    await sendDirectCast({
      recipientFid: fid,
      message: `
🚀 Intori has successfully added your channel /${newChannelFrame.channelId}!


Here is your channel frame ready to share:
${process.env.NEXTAUTH_URL}/frames/channels/${newChannelFrame.channelId}

To edit your channel's frame, see potential members, and stats 👉 visit https://www.intori.co
`
    })

    // for rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}
