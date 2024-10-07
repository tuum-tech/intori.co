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

        if (invites.length === 0) {
          return
        }

        console.table(invites)

        for (let i = 0; i < invites.length; i++) {
          const { channelId } = invites[i]
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
        console.error('Check for channel invites error:')
        console.error(err)
      }
    },
    null, // onComplete function handler
    true // start now
)
