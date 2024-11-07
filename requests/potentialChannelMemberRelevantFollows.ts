import axios, { AxiosResponse } from 'axios'
import { PotentialChannelMemberType } from '../models/potentialChannelMember'
import { PotentialChannelMemberRelevantFollow } from '../models/potentialChannelMemberRelevantFollows'

export const getPotentialChannelMemberRelevantFollows = (params: {
  channelId: string
  potentialMemberFid: number
}): Promise<AxiosResponse<PotentialChannelMemberRelevantFollow []>> => {
  return axios.get('/api/potential-members/relevant-follows', { params })
}
