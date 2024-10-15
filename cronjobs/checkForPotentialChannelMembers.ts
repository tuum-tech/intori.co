import { CronJob } from 'cron'
import { everyFiveMinutes } from './cronJobHelpers'
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
    everyFiveMinutes,
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

        await Promise.all(
          reactionsToCheck.map(async (reaction) => {
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
