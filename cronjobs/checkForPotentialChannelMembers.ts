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

        await Promise.all(
          reactionsFromAdminInChannel.map(async (reaction) => {
            const { fid } = reaction.cast.author
            const channelId = reaction.cast.channel.id

            const isMember = await isUserMemberOfChannel({ fid, channelId })
            if (isMember) {
              await deletePotentialChannelMember({ fid, channelId })
            } else {
              const castHash = reaction.cast.hash
              const parentCastHash = reaction.cast.parent_hash

              if (!parentCastHash) {
                return
              }

              await createPotentialChannelMember({
                fid,
                channelId,
                castHash,
                parentCastHash
              })
            }
          })
        )
      }
    },
    null, // onComplete function handler
    true // start now
)
