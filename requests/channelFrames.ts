import axios, { AxiosResponse } from 'axios'
import { CreateChannelFrameType, ChannelFrameType } from '../models/channelFrames'

export const createChannelFrame = async (
  body: CreateChannelFrameType
): Promise<AxiosResponse<ChannelFrameType>> => {
  return axios.post(`/api/channelFrames`, body)
}
