import axios, { AxiosResponse } from 'axios'

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

type GetFollowingChannelsResponse = {
  result: {
    channels: {
      id: string
    }[]
  }
  next: {
    cursor?: string
  }
}
export const getAllFollowingChannelIdsOfUser = async (
  fid: number
): Promise<string[]> => {
  let cursor
  const channelIds: string[] = []

  do {
    try {
      const res: AxiosResponse<GetFollowingChannelsResponse> = await warpcastApi.get('/v1/user-following-channels', {
        params: {
          fid,
          limit: 100,
          cursor
        }
      })

      if (res.data?.next?.cursor) {
        cursor = res.data.next.cursor
      }

      channelIds.push(
        ...res.data.result.channels.map(
          (channel: { id: string }) => channel.id
        )
      )
    } catch (err) {
      console.error(`Warpcast API error failed to get following channels for user: ${fid}`, err)
      return channelIds
    }
  } while (cursor)

  return channelIds
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
