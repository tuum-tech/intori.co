import axios, { AxiosResponse } from 'axios'
import { FarcasterUserType, FarcasterCastType } from '../utils/neynarApi'

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
