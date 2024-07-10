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

  const invalidUsernameRegex = /^!\d+$/;

  return users.filter((user) => {
    return !invalidUsernameRegex.test(user.username)
  }).map((user) => ({
    username: user.username,
    displayName: user.display_name,
    bio: user.profile.bio,
    fid: user.fid,
    image: user.pfp_url
  }))
}

export const fetchVerifiedEthereumAddressesForUser = async (
  fid: number
): Promise<string[]> => {
  const { users } = await neynar.fetchBulkUsers([fid])

  if (!users.length) {
    return []
  }

  const user = users[0]

  return user.verified_addresses.eth_addresses
}
