import { CronJob } from 'cron'
import { isAxiosError } from 'axios'
import { everyHour } from './cronJobHelpers'
import {
  getPotentialChannelMembers,
  deletePotentialChannelMember
} from '../models/potentialChannelMember'
import { isUserMemberOfChannel } from '../utils/warpcast'

export const startCheckForPotentialMembersThatBecameMembers = (): CronJob => new CronJob(
    everyHour,
    async () => {
      try {
        const allPotentialMembers = await getPotentialChannelMembers()

        for (let i = 0; i < allPotentialMembers.length; i++) {
          const { fid, channelId } = allPotentialMembers[i]
          const isMemberNow = await isUserMemberOfChannel({ fid, channelId })

          if (isMemberNow) {
            await deletePotentialChannelMember({ fid, channelId })
          }
        }
      } catch (err) {
        console.error('Check for channel invites error:')
        if (isAxiosError(err)) {
          console.log(err.response?.status)
        }
      }
    },
    null, // onComplete function handler
    true // start now
)
