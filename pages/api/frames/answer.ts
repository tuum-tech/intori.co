import type { NextApiRequest, NextApiResponse } from 'next'
import {
  frameSubmissionHelpers
} from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { createUserAnswer } from '../../../models/userAnswers'
import {
  incrementSessionQuestion,
  getFrameSessionById,
  createFrameSession
} from '../../../models/frameSession'
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
    console.log('ERROR: no question found')
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  let session = await getFrameSessionById(frameSessionId)

  if (!session) {
    const successful = await createFrameSession({ fid })

    if (!successful) {
      console.log('failed to create new frame session')
      return res.redirect(
        307,
        createFrameErrorUrl()
      )
    }

    session = await getFrameSessionById(successful.id)
  }

  if (!session) {
    console.log('ERROR: no session created or found')
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const successful = await incrementSessionQuestion(session.id)

  if (!successful) {
    console.log('failed to incrementSessionQuestion')
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
    createFrameResultsUrl({
      fid,
      frameSessionId: session.id
    })
  )
}

export default answeredQuestion
