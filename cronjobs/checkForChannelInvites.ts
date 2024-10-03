import { CronJob } from 'cron'
import { everyMinute } from './cronJobHelpers'
import { getIntoriChannelInvites } from '../utils/warpcast'
import {
  acceptChannelInvite,
  getChannelDetails
} from '../utils/neynarApi'
import {
  createChannelFrame,
  getChannelFrame
} from '../models/channelFrames'

export const startCheckForChannelInvitesJob = (): CronJob => new CronJob(
    everyMinute,
    async () => {
      try {
        const invites = await getIntoriChannelInvites()
        const moderatorInvites = invites.filter(({ role }) => role === 'moderator')

        if (moderatorInvites.length === 0) {
          console.log('no invites')
          return
        }

        console.table(moderatorInvites)

        for (let i = 0; i < moderatorInvites.length; i++) {
          const { channelId } = moderatorInvites[i]
          const acceptResponse = await acceptChannelInvite({ channelId })

          if (!acceptResponse.success) {
            continue
          }

          const channelFrameExists = await getChannelFrame(channelId)
          if (channelFrameExists) {
            continue
          }

          const channelDetails = await getChannelDetails(channelId)
          if (!channelDetails || !channelDetails.adminFid) {
            continue
          }

          const newChannelFrame = {
            channelId,
            introQuestionIds: [],
            adminFid: channelDetails.adminFid
          }

          await createChannelFrame(newChannelFrame)
        }
      } catch (err) {
        console.error(err.message)
      }
    },
    null, // onComplete function handler
    true // start now
)
