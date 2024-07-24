import type { NextApiRequest, NextApiResponse } from 'next'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { getAvailableQuestions } from '../../../utils/frames/questions'
import { getFrameSessionFromRequest } from '../../../models/frameSession'
import { createUserQuestionSkip } from '../../../models/userQuestionSkip'
import {
  createFrameErrorUrl,
} from '../../../utils/frames/generatePageUrls'
import giveNewQuestion from './question'

// User is requesting a new question
const newQuestion = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const validFarcasterPacket = await validateFarcasterPacketMessage(req.body)

  if (!validFarcasterPacket) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const session = await getFrameSessionFromRequest(req)

  if (!session) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  if (req.query.qi) {
    const questionIndex = parseInt(req.query.qi as string, 10)
    const questionToSkip = getAvailableQuestions({ channelId: session.channelId })[questionIndex]

    await createUserQuestionSkip({
      fid: session.fid,
      question: questionToSkip.question
    })
  }

  return giveNewQuestion(req, res)
}

export default newQuestion
