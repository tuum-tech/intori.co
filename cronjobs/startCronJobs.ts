import config from '../config'
config()

import { startCheckForPotentialChannelMembersJob } from './checkForPotentialChannelMembers'
import { startCheckForNewChannelsJob } from './checkForNewChannels'
import { startCheckForPotentialMembersThatBecameMembers } from './checkForPotentialMembersThatBecameMembers'

const startCronJobs = (): void => {
  startCheckForNewChannelsJob()
  startCheckForPotentialChannelMembersJob()
  startCheckForPotentialMembersThatBecameMembers()
}

startCronJobs()
