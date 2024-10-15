import { CronJob } from 'cron'
import { everyTenMinutes } from './cronJobHelpers'
import {
  getUserReactionsToCommentsInChannel,
  getMembersOfChannel
} from '../utils/neynarApi'
import {
  getAllChannelFrames
} from '../models/channelFrames'
import { 
  createPotentialChannelMember,
  deletePotentialChannelMember
} from '../models/potentialChannelMember'
import { isUserMemberOfChannel } from '../utils/warpcast'
import { notifySuperAdminOfError } from '../utils/sendDirectCast'

export const startCheckForPotentialChannelMembersJob = (): CronJob => new CronJob(
    everyTenMinutes,
    async () => {
      const channels = await getAllChannelFrames()

      for (let i = 0; i < channels.length; i++) {
        const { channelId, adminFid } = channels[i]

        const membersOfChannel = await getMembersOfChannel({ channelId })
        const moderators = membersOfChannel.filter((member) => member.role === 'moderator')

        const fidsToCheckReactions = moderators.map((moderator) => moderator.user.fid)
        fidsToCheckReactions.push(adminFid)

        const reactionsToCheck = []

        for (let i = 0; i < fidsToCheckReactions.length; i++) {
          const fid = fidsToCheckReactions[i]

          try {
            const reactions = await getUserReactionsToCommentsInChannel({
              channelId,
              fid
            })

            await new Promise((resolve) => setTimeout(resolve, 500))
            reactionsToCheck.push(...reactions)
          } catch (err) {
            await notifySuperAdminOfError(err, `cronjob get reactions of ${fid} in channel ${channelId}`)
          }
        }

        for (let i = 0; i < reactionsToCheck.length; i++) {
          const reaction = reactionsToCheck[i]
          const { fid } = reaction.cast.author

          const isMember = await isUserMemberOfChannel({ fid, channelId })
          if (isMember) {
            await deletePotentialChannelMember({ fid, channelId })
          } else {
            const castHash = reaction.cast.hash

            await createPotentialChannelMember({
              fid,
              channelId,
              castHash
            })
          }

          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
    },
    null, // onComplete function handler
    true // start now
)
