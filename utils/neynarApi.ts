import { NeynarAPIClient } from '@neynar/nodejs-sdk'

const neynar = new NeynarAPIClient(
  process.env.NEYNAR_API_KEY || 'Please add NEYNAR_API_KEY to env'
)

export type FarcasterChannelType = {
  id: string
  url: string

  name?: string
  imageUrl?: string
}

export type FarcasterUserType = {
  username: string
  fid: number
  image?: string
}

export const getChannelsThatUserFollows = async (
  fid: number,
  limit: number
): Promise<FarcasterChannelType[]> => {
  const { channels } = await neynar.fetchUserChannels(fid, { limit })

  return channels.map((channel) => ({
    id: channel.id,
    url: channel.url,
    name: channel.name,
    imageUrl: channel.image_url
  }))
}

export const fetchUserDetailsByFids = async (fids: number[]): Promise<FarcasterUserType[]> => {
  const { users } = await neynar.fetchBulkUsers(fids)

  return users.map((user) => ({
    username: user.username,
    fid: user.fid,
    image: user.pfp_url,
  }))
}
