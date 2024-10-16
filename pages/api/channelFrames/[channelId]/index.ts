import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import * as yup from 'yup'
import {
  getChannelFrame,
  updateChannelFrame,
  UpdateChannelFrameBodyType
} from '../../../../models/channelFrames'
import { allowedToEditChannel } from '../../../../utils/canEditChannel'

const updateDeleteGetChannelFrame = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)
  const channelId = req.query.channelId as string

  if (req.method !== 'PUT' || !channelId) {
    return res.status(405).end()
  }

  const channelFrame = await getChannelFrame(channelId)

  if (!channelFrame) {
    return res.status(404).json({
      error: "Channel frame not found."
    })
  }

  const allowed = await allowedToEditChannel(fid, channelFrame)
  if (!allowed) {
    return res.status(403).json({
      error: "You do not have permission to update this channel frame."
    })
  }

  const updateBody = await yup.object({
    introQuestionIds: yup.array().of(yup.string()).min(1).max(3).required()
  }).validate(req.body, { stripUnknown: true }) as UpdateChannelFrameBodyType


  const updatedChannel = await updateChannelFrame(channelId, updateBody)

  return res.status(200).json(updatedChannel)
}

export default updateDeleteGetChannelFrame
