import axios, { AxiosResponse } from 'axios'
import { CreateChannelFrameType, ChannelFrameType, UpdateChannelFrameBodyType } from '../models/channelFrames'

export const createChannelFrame = async (
  body: CreateChannelFrameType
): Promise<AxiosResponse<ChannelFrameType>> => {
  return axios.post(`/api/channelFrames`, body)
}

export const updateChannelFrame = async (
  channelId: string,
  body: UpdateChannelFrameBodyType
): Promise<AxiosResponse<ChannelFrameType>> => {
  return axios.put(`/api/channelFrames/${channelId}`, body)
}
