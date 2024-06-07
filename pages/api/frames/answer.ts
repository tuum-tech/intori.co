import type { NextApiRequest, NextApiResponse } from 'next'
import {
  frameSubmissionHelpers
} from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { createUserAnswer } from '../../../models/userAnswers'
import { incrementSessionQuestion } from '../../../models/frameSession'
import { createFrameErrorUrl, createFrameResultsUrl } from '../../../utils/frames/generatePageUrls'

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
      createFrameErrorUrl()
    )
  }
  
  const {
    fid,
    buttonClicked,
    question,
    fidThatCastedFrame,
    frameSessionId
  } = frameSubmissionHelpers(req)

  if (!question) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const successful = await incrementSessionQuestion(frameSessionId)

  if (!successful) {
    return res.redirect(
      307,
      createFrameErrorUrl()
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
    createFrameResultsUrl({ fid })
  )
}

export default answeredQuestion
