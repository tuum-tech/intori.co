import axios, { AxiosResponse } from 'axios'
import { PotentialChannelMemberType } from '../models/potentialChannelMember'

export const getPotentialMembers = (params: {
  channelId?: string
}): Promise<AxiosResponse<PotentialChannelMemberType[]>> => {
  return axios.get('/api/potential-members', { params })
}

export const getPotentialMemberMemberFollowers = (
  fid: number,
  params: {
    channelId: string
  }
): Promise<AxiosResponse<Array<{ fid: number, role: 'member' | 'moderator'}>>> => {
  return axios.get(`/api/potential-members/${fid}/member-followers`, { params })
}
