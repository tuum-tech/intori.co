import axios from 'axios'

export type ChannelInviteType = {
  channelId: string
  invitedFid: number,
  invitedAt: number,
  inviterFid: number
  role: 'member' | 'moderator'
}

export const getIntoriChannelInvites = async (): Promise<ChannelInviteType[]> => {
  try {
    const res = await axios.get(
      'https://api.warpcast.com/fc/channel-invites',
      {
        params: {
          fid: process.env.INTORI_USER_FID
        }
      }
    )

    return res.data?.result?.invites ?? []
  } catch (err) {
    return []
  }
}
