import type { NextApiRequest, NextApiResponse } from 'next'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { getQuestionById } from '../../../models/questions'
import { getFrameSessionFromRequest } from '../../../models/frameSession'
import { createUserQuestionSkip } from '../../../models/userQuestionSkip'
import {
  createFrameErrorUrl,
} from '../../../utils/urls'
import giveNewQuestion from './question'

const skipQuestion = async (
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
    const questionId = req.query.qi
    const questionToSkip = await getQuestionById(questionId.toString())

    if (!questionToSkip) {
      console.error('Failed to skip question:', questionId)
      return res.redirect(
        307,
        createFrameErrorUrl()
      )
    }

    await createUserQuestionSkip({
      fid: session.fid,
      question: questionToSkip.question
    })
  }

  return giveNewQuestion(req, res)
}

export default skipQuestion
