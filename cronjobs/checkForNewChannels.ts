import { CronJob } from 'cron'
import util from 'util'
import { isAxiosError } from 'axios'
import { everyMinute } from './cronJobHelpers'
import {
  getChannelDetails,
  getMembershipsOfUser
} from '../utils/neynarApi'
import {
  getAllFollowingChannelIdsOfUser,
  isUserMemberOfChannel
} from '../utils/warpcast'
import {
  createChannelFrame,
  getChannelFrame
} from '../models/channelFrames'
import { notifyOwnerAndModeratorsOfChannelIntoriAdded } from '../utils/sendDirectCast'

export const startCheckForNewChannelsJob = (): CronJob => new CronJob(
    everyMinute,
    async () => {
      try {
        const intoriFid = parseInt(process.env.INTORI_USER_FID ?? '294394', 10) ?? 294394
        const followedChannelIds = await getAllFollowingChannelIdsOfUser(intoriFid)

        for (let i = 0; i < followedChannelIds.length; i++) {
          const channelId = followedChannelIds[i]

          const isMember = await isUserMemberOfChannel({
            fid: intoriFid,
            channelId
          })

          if (!isMember) {
            continue
          }

          const channelFrameExists = await getChannelFrame(channelId)

          if (channelFrameExists) {
            continue
          }

          console.log(channelId, ' is a new channel')

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
