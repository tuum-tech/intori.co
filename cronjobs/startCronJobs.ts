import config from '../config'
config()

import { startCheckForChannelInvitesJob } from './checkForChannelInvites'
import { startCheckForPotentialChannelMembersJob } from './checkForPotentialChannelMembers'

const startCronJobs = (): void => {
  startCheckForChannelInvitesJob()
  startCheckForPotentialChannelMembersJob()
}

startCronJobs()
