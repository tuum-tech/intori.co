import { CronJob } from 'cron'
import { everyFiveMinutes } from './cronJobHelpers'
import {
  getUserReactionsToCommentsInChannel
} from '../utils/neynarApi'
import {
  getAllChannelFrames
} from '../models/channelFrames'
import { 
  createPotentialChannelMember,
  deletePotentialChannelMember
} from '../models/potentialChannelMember'
import { isUserMemberOfChannel } from '../utils/warpcast'

export const startCheckForPotentialChannelMembersJob = (): CronJob => new CronJob(
    everyFiveMinutes,
    async () => {
      const channels = await getAllChannelFrames()

      for (let i = 0; i < channels.length; i++) {
        const { channelId, adminFid } = channels[i]

        const reactionsFromAdminInChannel = await getUserReactionsToCommentsInChannel({
          channelId,
          fid: adminFid
        })

        const reactionFids = reactionsFromAdminInChannel.map((reaction) => reaction.cast.author.fid)

        await Promise.all(
          reactionFids.map(async (fid) => {
            const isMember = await isUserMemberOfChannel({ fid, channelId })
            if (isMember) {
              await deletePotentialChannelMember({ fid, channelId })
            } else {
              await createPotentialChannelMember({ fid, channelId })
            }
          })
        )
      }
    },
    null, // onComplete function handler
    true // start now
)
