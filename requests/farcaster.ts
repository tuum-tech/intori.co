import axios, { AxiosResponse } from 'axios'
import {
  FarcasterUserType
} from '../utils/neynarApi'

export const getFarcasterUserDetails = (
  fid: number
): Promise<AxiosResponse<FarcasterUserType>> => {
  return axios.get(`/api/farcaster/user/${fid}`)
}
