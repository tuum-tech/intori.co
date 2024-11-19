import { CronJob } from 'cron'
import { everySunday } from './cronJobHelpers'
import { doesUserFollowUser } from '../utils/neynarApi'
import { getSavedMembersOfChannel } from '../models/channelMembers'
import {
  getAllChannelFrames
} from '../models/channelFrames'
import {
  getPotentialChannelMembers
} from '../models/potentialChannelMember'
import {
  isRelevantFollowSaved,
  createRelevantFollow
} from '../models/potentialChannelMemberRelevantFollows'

// Instead of constantly fetching neynar's api to get follows which is rate limited,
// We save the follows in our database and check if the follow is saved in our database
export const startCheckForMembersFollowingPotentialMember = (): CronJob => new CronJob(
    everySunday,
    async () => {
      const allChannelFrames = await getAllChannelFrames()

      for (let i = 0; i < allChannelFrames.length; i++) {
        const { channelId } = allChannelFrames[i]

        const membersOfChannel = await getSavedMembersOfChannel({ channelId })

        const potentialMembers = await getPotentialChannelMembers({ channelId })
        const uniquePotentialMemberFids = Array.from(
          new Set(potentialMembers.map(potentialMember => potentialMember.fid))
        )

        for (let j = 0; j < uniquePotentialMemberFids.length; j++) {
          const potentialMemberFid = uniquePotentialMemberFids[j]

          for (let k = 0; k < membersOfChannel.length; k++) {
            const member = membersOfChannel[k]

            const followSaved = await isRelevantFollowSaved({
              channelId,
              potentialMemberFid,
              followedByFid: member.fid
            })

            if (followSaved) {
              continue
            }

            const isFollowing = await doesUserFollowUser({
              doesThisFidFollow: member.fid,
              thisFid: potentialMemberFid
            })

            if (!isFollowing) {
              continue
            }

            await createRelevantFollow({
              channelId,
              potentialMemberFid,
              followedByFid: member.fid,
              followedByRole: member.role
            })

            // neynar api throttle for their rate limits
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        }
      }
    },
    null, // onComplete function handler
    true // start now
)
