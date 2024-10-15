import axios from 'axios'

export type ChannelInviteType = {
  channelId: string
  invitedFid: number,
  invitedAt: number,
  inviterFid: number
  role: 'member' | 'moderator'
}

const warpcastApi = axios.create({
  baseURL: 'https://api.warpcast.com'
})

export const getIntoriChannelInvites = async (): Promise<ChannelInviteType[]> => {
  try {
    const res = await warpcastApi.get(
      '/fc/channel-invites',
      {
        params: {
          fid: process.env.INTORI_USER_FID
        }
      }
    )

    return res.data?.result?.invites ?? []
  } catch (err) {
    console.error('Warpcast API error:', err)
    return []
  }
}

export const isUserMemberOfChannel = async (params: {
  fid: number
  channelId: string
}): Promise<boolean> => {
  try {
    const res = await warpcastApi.get('/fc/channel-members', { params })

    if (!res.data.result) {
      return false
    }

    return res.data.result.members?.length > 0
  } catch (err) {
    console.error(`Warpcast API error failed to check ${params.fid} in ${params.channelId}`, err)
    return false
  }
}

export const getAllChannels = async () => {
  try {
    const res = await warpcastApi.get('/v2/all-channels')

    if (!res.data.result?.channels) {
      return []
    }

    return res.data.result.channels as Array<{ id: string }>
  } catch (err) {
    console.error('Warpcast API error:', err)
    return []
  }
}
