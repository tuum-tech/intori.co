import config from '../config'
config()

import { startCheckForPotentialChannelMembersJob } from './checkForPotentialChannelMembers'
import { startCheckForNewChannelsJob } from './checkForNewChannels'
import { startCheckForPotentialMembersThatBecameMembers } from './checkForPotentialMembersThatBecameMembers'
import { startCheckForMembersFollowingPotentialMember } from './checkForMembersFollowingPotentialMembers'

const startCronJobs = (): void => {
  startCheckForNewChannelsJob()
  startCheckForPotentialChannelMembersJob()
  startCheckForPotentialMembersThatBecameMembers()
  startCheckForMembersFollowingPotentialMember()
}

startCronJobs()
