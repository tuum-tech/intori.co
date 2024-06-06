import type { NextApiRequest, NextApiResponse } from 'next'
import {
  frameSubmissionHelpers
} from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { createUserAnswer } from '../../../models/userAnswers'

const answeredQuestion = async (
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
      `/frames/error`
    )
  }
  
  const {
    fid,
    buttonClicked,
    question,
    fidThatCastedFrame
  } = frameSubmissionHelpers(req)

  if (!question) {
    return res.redirect(
      307,
      `/frames/error`
    )
  }

  // const alreadyAnswered = await getUserAnswerForQuestion(fid, question.question)
  // if (alreadyAnswered) {
  //   return res.status(400).end()
  // }

  await createUserAnswer({
    fid,
    question: question.question,
    answer: buttonClicked,
    casterFid: fidThatCastedFrame
  })

  return res.redirect(
    307,
    `/frames/results?fid=${fid}`
  )
}

export default answeredQuestion
