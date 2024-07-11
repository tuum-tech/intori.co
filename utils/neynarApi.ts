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
  displayName?: string
  bio?: string
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
    bio: user.profile.bio.text,
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

export const getLastCastForUser = async (fid: number) => {
  const res = await neynar.fetchAllCastsCreatedByUser(fid, { limit: 1 })

  // timestamp looks like "2024-07-10T05:45:57.000Z",
  return res.result.casts[0]
}

export const doesUserFollowIntori = async (fid: number): Promise<boolean> => {
  let foundIntori = false
  let cursor: string | null = ''

  while (!foundIntori) {
    const following = await neynar.fetchUserFollowingV2(
      fid,
      {
        limit: 100,
        sortType: 'desc_chron',
        cursor: cursor || undefined
      }
    )

    console.log({ following })
    console.log(following.users[0])
    const followingFids = following.users.map((user) => user.fid)
    console.log({ followingFids })

    if (followingFids.includes(294394)) {
      foundIntori = true
    } 

    if (!following.next.cursor) {
      break
    }

    cursor = following.next.cursor
    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  return foundIntori
}
