import { CronJob } from 'cron'
import util from 'util'
import { isAxiosError } from 'axios'
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
import {
  saveChannelMembersForChannel
} from '../models/channelMembers'
import { notifyOwnerAndModeratorsOfChannelIntoriAdded } from '../utils/sendDirectCast'

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
          const { channelId, role } = invites[i]

          const acceptResponse = await acceptChannelInvite({
            channelId,
            role
          })

          console.log(acceptResponse)
          console.log('Message:', acceptResponse.message)
          console.log('Success:', acceptResponse.success)

          if (!acceptResponse.success) {
            console.log('ERROR: Failed to accept channel invite')
            console.log('ERROR:', acceptResponse.message)
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
            introQuestionIds: [
              'c9c8b085-6177-4455-9705-4e548007ddc0',
              'de471cde-a3c5-4584-9b68-7e7e1b2346fd',
              'c692ed8b-3bbc-46d9-bc91-7ba464dfa730'
            ],
            adminFid: channelDetails.adminFid
          }

          await createChannelFrame(newChannelFrame)
          await notifyOwnerAndModeratorsOfChannelIntoriAdded(newChannelFrame)
          await saveChannelMembersForChannel(newChannelFrame.channelId)
        }
      } catch (err) {
        console.error('Check for channel invites error:')
        if (isAxiosError(err)) {
          console.log(err.response?.status)
          console.log(util.inspect(err?.response?.data, false, null, true))
        }
      }
    },
    null, // onComplete function handler
    true // start now
)
