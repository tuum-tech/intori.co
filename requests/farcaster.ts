import axios, { AxiosResponse } from 'axios'
import {
  FarcasterUserType,
  FarcasterCastType,
  FarcasterChannelType,
  FarcasterChannelMemberType
} from '../utils/neynarApi'

export const getFarcasterUserDetails = (
  fid: number
): Promise<AxiosResponse<FarcasterUserType>> => {
  return axios.get(`/api/farcaster/user/${fid}`)
}

export const getFarcasterCastDetails = (
  hash: string
): Promise<AxiosResponse<FarcasterCastType>> => {
  return axios.get(`/api/farcaster/cast/${hash}`)
}

export const getFarcasterChannelDetails = (
  channelId: string
): Promise<AxiosResponse<FarcasterChannelType>> => {
  return axios.get(`/api/farcaster/channel/${channelId}`)
}

export const getChannelMembers = (
  channelId: string
): Promise<AxiosResponse<FarcasterChannelMemberType[]>> => {
  return axios.get(`/api/farcaster/channel-members/${channelId}`)
}

export const getRelevantFollowers = (
  fid: number
): Promise<AxiosResponse<{
  top: FarcasterUserType[]
  others: number
}>> => {
  return axios.get(`/api/farcaster/relevant-followers`, { params: { fid } })
}
