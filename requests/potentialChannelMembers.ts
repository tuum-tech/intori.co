import axios, { AxiosResponse } from 'axios'
import { PotentialChannelMemberType } from '../models/potentialChannelMember'

export const getPotentialMembers = (params: {
  channelId?: string
}): Promise<AxiosResponse<PotentialChannelMemberType[]>> => {
  return axios.get('/api/potential-members', { params })
}
