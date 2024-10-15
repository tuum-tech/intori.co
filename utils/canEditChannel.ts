import { isSuperAdmin } from '../utils/isSuperAdmin'
import { ChannelFrameType } from '../models/channelFrames'
import { FarcasterChannelType } from '../utils/neynarApi'
import { getModeratedChannelsOfUser } from '../utils/neynarApi'

export const allowedToEditChannel = async (
  fid: number,
  channel: ChannelFrameType | FarcasterChannelType
): Promise<boolean> => {
  if (!fid) {
    return false
  }

  if (isSuperAdmin(fid)) {
    return true
  }

  if (channel.adminFid === fid) {
    return true
  }

  const moderatoredChannelIds = await getModeratedChannelsOfUser(fid)

  const channelId = (channel as ChannelFrameType).channelId || (channel as FarcasterChannelType).id

  return moderatoredChannelIds.includes(channelId)
}
