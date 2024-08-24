import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createFrameErrorUrl
} from '@/utils/urls'
import { getChannelFrame } from '@/models/channelFrames'
import { getChannelDetails } from '@/utils/neynarApi'
import { createChannelFrameIntroImage } from '@/utils/frames/createChannelFrameIntroImage'

const createChannelIntroImage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const channelId = (req.query.channelId ?? '').toString()
  const channelFrame = await getChannelFrame(channelId)

  if (!channelFrame) {
    return res.redirect(createFrameErrorUrl())
  }

  const channelDetails = await getChannelDetails(channelId)

  if (!channelDetails) {
    return res.redirect(createFrameErrorUrl())
  }

  const { name, imageUrl, followCount } = channelDetails

  const buffer = await createChannelFrameIntroImage({
    name: name as string,
    imageUrl: imageUrl as string,
    followCount: followCount as number
  })

  // cache for 7 days
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
  res.setHeader('Content-Type', 'image/png')

  return res.status(200).send(buffer)
}

export default createChannelIntroImage
