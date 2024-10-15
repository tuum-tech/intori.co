import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import * as yup from 'yup'
import { getChannelDetails } from '../../../utils/neynarApi'
import { ChannelFrameType, getChannelFrame, createChannelFrame } from '../../../models/channelFrames'
import { allowedToEditChannel } from '@/utils/canEditChannel'

const createGetChannelFrames = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)

  if (req.method === 'POST') {
    try {
      const validBody = await yup.object().shape({
        channelId: yup.string().required(),
        introQuestionIds: yup.array().of(yup.string()).max(3).required()
      }).validate(req.body, { stripUnknown: true })

      if (validBody.channelId.startsWith('/')) {
        validBody.channelId = validBody.channelId.slice(1)
      }

      const channel = await getChannelDetails(validBody.channelId)

      if (!channel) {
        return res.status(400).json({ error: 'Channel does not exist.' })
      }

      const channelFrameExists = await getChannelFrame(validBody.channelId)

      if (channelFrameExists) {
        return res.status(400).json({ error: 'Channel frame is not available.' })
      }

      const allowed = await allowedToEditChannel(fid, channel)
      if (!allowed) {
        return res.status(403).json({
          error: 'Sorry, you must be the owner of the channel to create an Intori channel frame.'
        })
      }

      const channelFrame = await createChannelFrame({
        ...validBody,
        adminFid: channel.adminFid as number,
        addedByFid: fid
      } as ChannelFrameType)

      return res.status(201).json(channelFrame)
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message })
    }
  }

  return res.status(404).end()
}

export default createGetChannelFrames
