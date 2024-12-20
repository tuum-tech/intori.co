import { NeynarAPIClient, FeedType, FilterType } from '@neynar/nodejs-sdk'
import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/user'
import { CastAuthor } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/cast-author'
import config from '../config'

// Nextjs has it's own way of handling environment variables
// so if not running through nextjs, like cronjobs, we need to load the env vars
if (!process.env.NEYNAR_API_KEY) {
  config()
}

export const neynar = new NeynarAPIClient(
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

export type FarcasterCastType = {
  object: string;
  hash: string;
  thread_hash: string;
  parent_hash: string;
  parent_url: string | null;
  root_parent_url: string | null;
  parent_author: {
    fid: number;
  };
  author: {
    object: string;
    fid: number;
    custody_address: string;
    username: string;
    display_name: string;
    pfp_url: string;
    profile: {
      bio: {
        text: string;
      };
    };
    follower_count: number;
    following_count: number;
    verifications: string[];
    verified_addresses: {
      eth_addresses: string[];
      sol_addresses: string[];
    };
    active_status: string;
    power_badge: boolean;
  };
  text: string;
  timestamp: string;
  embeds: any[]; // Assuming it's an array, but you can replace `any[]` with the exact type if known
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: {
      fid: number;
      fname: string;
    }[];
    recasts: any[]; // Assuming it's an array, but replace with the correct type if necessary
  };
  replies: {
    count: number;
  };
  channel: string | null;
  mentioned_profiles: any[]; // Assuming it's an array, but replace `any[]` with the exact type if known
}

export type FarcasterChannelMemberType = {
  channel_id: string
  role: 'member' | 'moderator'
  user: {
    fid: number
    username: string
    pfp_url: string
  }
}

export const serializeUser = (user: User | CastAuthor): FarcasterUserType => ({
    username: user.username as string,
    displayName: user.display_name,
    bio: (user as User).profile?.bio?.text ?? '',
    fid: user.fid,
    image: user.pfp_url,
    powerBadge: !!(user as User).power_badge
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
        followingFids.length
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

export const getRecentCastsInChannel = async (params: {
  channelId: string
  limit: number
}) => {

  const { channelId, limit } = params

  const res = await neynar.fetchFeedByChannelIds([channelId], {
    shouldModerate: true,
    limit
  })

  return res.casts
}

export const acceptChannelInvite = async (params: {
  channelId: string
  role: 'moderator' | 'member'
}) => {
  return neynar.respondChannelInvite(
    process.env.NEYNAR_SIGNER_UUID ?? 'missing signer uuid',
    params.channelId,
    params.role,
    true
  )
}

export const getUserReactionsToCommentsInChannel = async (params: {
  channelId: string
  fid: number
}) => {
  const res = await neynar.fetchUserReactions(
    params.fid,
    'likes',
    { limit: 50 }
  )

  return res.reactions.filter((reaction) => {
    if (!reaction.cast?.channel) {
      return false
    }

    const isCommentReply = !!reaction.cast.parent_author.fid

    return isCommentReply && reaction.cast.channel.id === params.channelId
  })
}

export const fetchCastDetails = async (castHash: string) => {
  const res = await neynar.lookUpCastByHashOrWarpcastUrl(castHash, 'hash')
  return res.cast
}

export const getMembersOfChannel = async (params: {
  channelId: string
}) => {
  const members = []
  let cursor: string | null | undefined = null

  do {
    const res = await neynar.fetchChannelMembers(params.channelId, {
      limit: 100,
      cursor: cursor || undefined
    })

    cursor = res.next?.cursor
    members.push(...res.members)

    await new Promise((resolve) => setTimeout(resolve, 500))
  } while (cursor)

  return members
}

export const getMembershipsOfUser = async (fid: number) => {
  let cursor: string | null = ''
  const channelMemberships = []

  do {
    const res = await neynar.fetchUserChannelMemberships(fid, {
      limit: 100,
      cursor: cursor || undefined
    })

    channelMemberships.push(...res.members)

    cursor = res.next.cursor
  } while(cursor)

  return channelMemberships
}

export const getModeratedChannelsOfUser = async (fid: number) => {
  const channelMemberships = await getMembershipsOfUser(fid)

  const moderatorChannels = channelMemberships.filter((membership) => {
    return membership.role === 'moderator'
  })

  return moderatorChannels.map((membership) => membership.channel.id)
}

export const intoriFollowChannel = async (channelId: string) => {
  await neynar.followChannel(
    process.env.NEYNAR_SIGNER_UUID ?? 'missing signer uuid',
    channelId
  )
}

export const doesUserFollowUser = async (params: {
  doesThisFidFollow: number,
  thisFid: number
 }): Promise<boolean> => {
  const { doesThisFidFollow, thisFid } = params

  try {
    const res = await neynar.fetchBulkUsers([thisFid], {
      viewerFid: doesThisFidFollow
    })

    if (!res.users.length) {
      return false
    }

    return !!res.users[0].viewer_context?.following
  } catch (err) {
    console.error('Failed to check if ', thisFid, ' follows ', doesThisFidFollow)
  }

  return false
}

export const doesUserFollowIntori = async (fid: number): Promise<boolean> => {
  return doesUserFollowUser({
    doesThisFidFollow: fid,
    thisFid: 294394
  })
}
