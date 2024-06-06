import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { getUserAnswerForQuestion } from '../../../models/userAnswers'
import { intoriQuestions } from '../../../utils/frames/intoriFrameForms'

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
      `/frames/error`
    )
  }

  const { fid } = frameSubmissionHelpers(req)

  // getting next answer offset to see more answers of an already given question
  if (req.query.qi && req.query.ioff) {
    const currentQuestionIndex = parseInt(req.query.qi as string, 10)
    const requestedAnswerOffset = parseInt(req.query.ioff as string, 10)

    return res.redirect(
      307,
      `/frames/question?qi=${currentQuestionIndex}&ioff=${requestedAnswerOffset}`
    )
  }

  let nextQuestionIndex = Math.floor(Math.random() * intoriQuestions.length)
  let nextQuestion = intoriQuestions[nextQuestionIndex]
  let alreadyAnsweredQuestion = await getUserAnswerForQuestion(fid, nextQuestion.question)
  let tries = 0;

  while (alreadyAnsweredQuestion && tries < 5) {
    tries += 1
    nextQuestionIndex = Math.floor(Math.random() * intoriQuestions.length)
    nextQuestion = intoriQuestions[nextQuestionIndex]
    alreadyAnsweredQuestion = await getUserAnswerForQuestion(fid, nextQuestion.question)
    break
  }

  if (tries === 5) {
    // TODO: add frame that you answered all questions
  }

  return res.redirect(
    307,
    `/frames/question?qi=${nextQuestionIndex}`
  )
}

export default newQuestion
