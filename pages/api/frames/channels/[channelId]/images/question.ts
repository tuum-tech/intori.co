import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createFrameErrorUrl
} from '@/utils/urls'
import { getChannelFrame } from '@/models/channelFrames'
import { getQuestionById } from '@/models/questions'
import { getChannelDetails } from '@/utils/neynarApi'
import { createChannelQuestionFrameImage } from '@/utils/frames/createChannelQuestionFrameImage'

// add channel logo to top
// add question text
// add answers
const createChannelQuestionImage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const questionId = (req.query.qid ?? '').toString()
  const channelId = (req.query.channelId ?? '').toString()

  if (!questionId || !channelId) {
    return res.redirect(createFrameErrorUrl())
  }

  const channelFrame = await getChannelFrame(channelId)

  if (!channelFrame) {
    return res.redirect(createFrameErrorUrl())
  }

  const channelDetails = await getChannelDetails(channelId)

  if (!channelDetails) {
    return res.redirect(createFrameErrorUrl())
  }

  const question = await getQuestionById(questionId)

  if (!question) {
    return res.redirect(createFrameErrorUrl())
  }

  const { imageUrl } = channelDetails

  const buffer = await createChannelQuestionFrameImage({
    question,
    channelImageUrl: imageUrl as string
  })

  // cache for 7 days
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
  res.setHeader('Content-Type', 'image/png')

  return res.status(200).send(buffer)
}

export default createChannelQuestionImage
