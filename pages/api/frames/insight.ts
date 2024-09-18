import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createFrameErrorUrl
} from '../../../utils/urls'
import { FrameSessionType, getFrameSessionById } from '../../../models/frameSession'
import { UserAnswerType, getUserAnswerForQuestion } from '../../../models/userAnswers'
import { getQuestionById } from '../../../models/questions'
import { getChannelDetails } from '@/utils/neynarApi'
import { createUnlockedInsightFrame } from '@/utils/frames/createUnlockedInsightFrame'

const getLastResponseFromFrameSession = async (
  session: FrameSessionType
): Promise<UserAnswerType | null> => {
  const { questionIds } = session
  questionIds.reverse()

  for (let i = 0; i < questionIds.length; i++) {
    const question = await getQuestionById(questionIds[i])

    if (!question) {
      continue
    }

    const userAnswer = await getUserAnswerForQuestion(session.fid, question.question)

    if (!userAnswer) {
      continue
    }

    return userAnswer
  }

  return null
}

// This will generate the 'you unlocked new insight' frame
const createUnlockedInsightImage  = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const frameSessionId = (req.query.fsid ?? '').toString()

  if (!frameSessionId) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const session = await getFrameSessionById(frameSessionId)

  if (!session?.channelId) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const responseToShow = await getLastResponseFromFrameSession(session)
  if (!responseToShow) {
    console.log('No response found from questions saved in session')
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const channelDetails = await getChannelDetails(session.channelId)

  if (!channelDetails) {
    console.log('No channel details found for channel id in session')
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const buffer = await createUnlockedInsightFrame({
    question: responseToShow.question,
    answer: responseToShow.answer,
    channelImageUrl: channelDetails.imageUrl as string
  })

  // cache for 7 days
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
  res.setHeader('Content-Type', 'image/png')

  return res.status(200).send(buffer)
}

export default createUnlockedInsightImage
