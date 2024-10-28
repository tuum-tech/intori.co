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
): Promise<UserAnswerType[]> => {
  const { questionIds } = session

  const answersToShow: UserAnswerType[] = []

  for (let i = 0; i < questionIds.length; i++) {
    const question = await getQuestionById(questionIds[i])

    if (!question) {
      continue
    }

    const userAnswer = await getUserAnswerForQuestion(session.fid, question.question)

    if (!userAnswer) {
      continue
    }

    answersToShow.push(userAnswer)
  }

  return answersToShow
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

  const answersToShowAsInsights = await getLastResponseFromFrameSession(session)
  if (!answersToShowAsInsights.length) {
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
    answers: answersToShowAsInsights,
    channelImageUrl: channelDetails.imageUrl as string
  })

  // cache for 7 days
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
  res.setHeader('Content-Type', 'image/png')

  return res.status(200).send(buffer)
}

export default createUnlockedInsightImage
