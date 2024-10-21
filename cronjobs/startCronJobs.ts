import config from '../config'
config()

import { startCheckForPotentialChannelMembersJob } from './checkForPotentialChannelMembers'
import { startCheckForNewChannelsJob } from './checkForNewChannels'

const startCronJobs = (): void => {
  startCheckForNewChannelsJob()
  startCheckForPotentialChannelMembersJob()
}

startCronJobs()
