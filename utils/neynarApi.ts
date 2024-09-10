import { NeynarAPIClient, FeedType, FilterType } from '@neynar/nodejs-sdk'
import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/user'

const neynar = new NeynarAPIClient(
  process.env.NEYNAR_API_KEY || 'please add neynar api key'
)

export type FarcasterChannelType = {
  id: string
  url: string

  followCount?: number
  description?: string
  name?: string
  imageUrl?: string
  adminFid?: number
}

export type FarcasterUserType = {
  username: string
  fid: number
  image?: string
  displayName?: string
  bio?: string
  powerBadge: boolean
}

const serializeUser = (user: User): FarcasterUserType => ({
    username: user.username,
    displayName: user.display_name,
    bio: user.profile.bio.text,
    fid: user.fid,
    image: user.pfp_url,
    powerBadge: user.power_badge ?? false
})

export const getChannelsThatUserFollows = async (
  fid: number,
  limit: number
): Promise<FarcasterChannelType[]> => {
  const { channels } = await neynar.fetchUserChannels(fid, { limit })

  return channels.map((channel) => ({
    id: channel.id,
    url: channel.url,
    name: channel.name,
    imageUrl: channel.image_url,

    followCount: channel.follower_count,
    description: channel.description
  }))
}

export const getRecentCastsForChannel = async (
  channelId: string,
  limit: number
) => {
  const res = await neynar.fetchFeed(FeedType.Filter, {
    filterType: FilterType.ChannelId,
    channelId,
    limit
  })

  return res.casts
}

export const fetchUserDetailsByFids = async (fids: number[]): Promise<FarcasterUserType[]> => {
  if (!fids.length) {
    return []
  }

  const { users } = await neynar.fetchBulkUsers(fids)

  const invalidUsernameRegex = /^!\d+$/;

  return users.filter((user) => {
    return !invalidUsernameRegex.test(user.username)
  }).map((user) => serializeUser(user))
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

    // @ts-expect-error because type definitions are not correct.
    const fids = following.users.map((user) => user.user.fid)

    for (let i = 0; i < fids.length; i++) {
      if (fids[i] === 294394) {
        foundIntori = true
        break
      }
    }

    if (!following.next.cursor) {
      break
    }

    cursor = following.next.cursor
    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  return foundIntori
}

export const getFidsUserIsFollowing = async (fid: number): Promise<number[]> => {
  const followingFids: number[] = []
  let cursor: string | null = ''
  let attempts = 0

  do {
    try {
      const following = await neynar.fetchUserFollowingV2(
        fid,
        {
          limit: 100,
          sortType: 'desc_chron',
          cursor: cursor || undefined
        }
      )

      // @ts-expect-error because type definitions are not correct.
      const fids = following.users.map((user) => user.user.fid)

      followingFids.push(...fids)

      if (!following.next.cursor) {
        break
      }

      cursor = following.next.cursor
      await new Promise((resolve) => setTimeout(resolve, 400))
    } catch (err) {
      console.error(
        'Got an error getting followings for user',
        fid,
        'Total followings so far',
        followingFids.length,
      )
      attempts++
    }
  } while (cursor && attempts < 3)

  return followingFids
}

export const getChannelDetails = async (channelId: string) => {
  try {
    const { channel } = await neynar.lookupChannel(channelId)

    return {
      id: channel.id,
      url: channel.url,
      name: channel.name,
      imageUrl: channel.image_url,
      description: channel.description,
      followCount: channel.follower_count,
      adminFid: channel.lead?.fid
    }
  } catch (err) {
    return null
  }
}

export const getFollowersOfChannel = async (params: {
  channelId: string
  limit: number
}) => {
  const { channelId, limit } = params

  const res = await neynar.fetchFollowersForAChannel(channelId, {
    limit
  })

  return res.users.map((follower) => serializeUser(follower))
}
