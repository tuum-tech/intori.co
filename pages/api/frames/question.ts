import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { getUserAnswerForQuestion } from '../../../models/userAnswers'
import { intoriQuestions } from '../../../utils/frames/intoriFrameForms'
import { getFrameSessionFromRequest, createFrameSession } from '../../../models/frameSession'
import {
  createFrameQuestionUrl,
  createFrameErrorUrl,
  createFrameResultsUrl
} from '../../../utils/frames/generatePageUrls'

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

  const { fid } = frameSubmissionHelpers(req)

  let session = await getFrameSessionFromRequest(req)

  if (!session) {
    session = await createFrameSession({ fid })
  }

  if (!session) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  if (session.questionNumber === 3) {
    return res.redirect(
      307,
      createFrameResultsUrl({ fid, frameSessionId: session.id })
    )
  }

  // getting next answer offset to see more answers of an already given question
  if (req.query.qi && req.query.ioff) {
    const currentQuestionIndex = parseInt(req.query.qi as string, 10)
    const requestedAnswerOffset = parseInt(req.query.ioff as string, 10)

    return res.redirect(
      307,
      createFrameQuestionUrl({
        questionIndex: currentQuestionIndex,
        answerOffset: requestedAnswerOffset,
        frameSessionId: session.id
      })
    )
  }

  let nextQuestionIndex = Math.floor(Math.random() * intoriQuestions.length)
  let nextQuestion = intoriQuestions[nextQuestionIndex]
  let alreadyAnsweredQuestion = await getUserAnswerForQuestion(fid, nextQuestion.question)
  let tries = 0;

  while (alreadyAnsweredQuestion && tries < 10) {
    tries += 1
    nextQuestionIndex = Math.floor(Math.random() * intoriQuestions.length)
    nextQuestion = intoriQuestions[nextQuestionIndex]
    alreadyAnsweredQuestion = await getUserAnswerForQuestion(fid, nextQuestion.question)
  }

  if (tries === 5) {
    // TODO: add frame that you answered all questions
  }

  return res.redirect(
    307,
    createFrameQuestionUrl({
      questionIndex: nextQuestionIndex,
      answerOffset: 0,
      frameSessionId: session.id
    })
  )
}

export default newQuestion
