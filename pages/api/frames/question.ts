import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import {
  getUserAnswerForQuestion,
  getLastAnsweredQuestionForUser
} from '../../../models/userAnswers'
import { appendQuestionToFrameSession } from '../../../models/frameSession'
import { getLastSkippedQuestions } from '../../../models/userQuestionSkip'
import { getAvailableQuestions } from '../../../utils/frames/questions'
import { createFrameSession } from '../../../models/frameSession'
import { hasUserReachedSixAnswerLimit } from '../../../utils/frames/limitSixAnswersPerDay'
import {
  createFrameQuestionUrl,
  createFrameErrorUrl,
  createFrameResultsUrl,
  createLimitReachedUrl,
  createAnsweredAllQuestionsUrl
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

  const { fid, channelId, session: initialSession } = await frameSubmissionHelpers(req)

  // If no session, create new frame session
  let session = initialSession
  if (!session) {
    session = await createFrameSession({ fid, channelId })
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
      createFrameResultsUrl({ frameSessionId: session.id })
    )
  }

  const availableQuestions = getAvailableQuestions({ channelId: session.channelId })

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

  if (!session.channelId) {
    const reachedLimit = await hasUserReachedSixAnswerLimit(fid)
    if (reachedLimit) {
      return res.redirect(
        307,
        createLimitReachedUrl({ frameSessionId: session.id })
      )
    }
  }

  let indexOfLastAnsweredQuestion = -1
  const lastAnsweredQuestion = await getLastAnsweredQuestionForUser(fid)

  if (lastAnsweredQuestion) {
    indexOfLastAnsweredQuestion = availableQuestions.findIndex(
      (question) => question.question === lastAnsweredQuestion.question
    )
  }

  if (indexOfLastAnsweredQuestion === availableQuestions.length - 1) {
      return res.redirect(
        307,
        createAnsweredAllQuestionsUrl({ frameSessionId: session.id })
      )
  }

  let nextQuestionIndex = indexOfLastAnsweredQuestion
  let nextQuestion = availableQuestions[nextQuestionIndex]

  const skippedQuestions = await getLastSkippedQuestions(fid, 5)
  let tries = 0;

  while (tries < 20) {
    tries += 1

    nextQuestionIndex = nextQuestionIndex + 1

    if (nextQuestionIndex === availableQuestions.length - 1) {
      return res.redirect(
        307,
        createAnsweredAllQuestionsUrl({ frameSessionId: session.id })
      )
    }

    nextQuestion = availableQuestions[nextQuestionIndex]

    if (skippedQuestions.includes(nextQuestion.question)) {
      continue
    }

    const alreadyAnsweredQuestion = await getUserAnswerForQuestion(fid, nextQuestion.question)

    if (!alreadyAnsweredQuestion) {
      break
    }
  }

  if (tries === 20) {
    console.log('Reached 20 tries to find a new question.')
    return res.redirect(
      307,
      createAnsweredAllQuestionsUrl({ frameSessionId: session.id })
    )
  }

  await appendQuestionToFrameSession(session.id, nextQuestion.question)

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
