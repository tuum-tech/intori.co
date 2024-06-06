import type { NextApiRequest, NextApiResponse } from 'next'
import {
  frameSubmissionHelpers
} from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import {
  createUserAnswer,
  getUserAnswerForQuestion
} from '../../../models/userAnswers'
import { intoriQuestions } from '../../../utils/frames/intoriFrameForms'

const submitFrame = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const validFarcasterPacket = await validateFarcasterPacketMessage(req.body)

  if (!validFarcasterPacket) {
    // TODO: show error frame
    return res.status(400).end()
  }

  const currentStep = parseInt(req.query.step?.toString() || '0') ?? 0
  const stepsThatRequireQuestion = [0, 2, 4]
  const stepsWhereAnswerSubmitted = [1, 3, 5]

  if (stepsThatRequireQuestion.includes(currentStep)) {
    return showNewQuestionFrame(req, res)
  }

  if (stepsWhereAnswerSubmitted.includes(currentStep)) {
    // save answer
    // show results
    //  if step === 5 show suggested user
    return showResultsFrame(req, res)
  }

  return res.status(400).end()

  // wants a question
  if ([0, 2, 4].includes(step)) {
    let nextQuestionIndex = Math.floor(Math.random() * intoriQuestions.length)
    let nextQuestion = intoriQuestions[questionIndex]
    let alreadyAnswered = await getUserAnswerForQuestion(fid, nextQuestion.question)
    let tries = 0;

    while (alreadyAnswered && tries < 5) {
      tries += 1
      nextQuestionIndex = Math.floor(Math.random() * intoriQuestions.length)
      nextQuestion = intoriQuestions[nextQuestionIndex]
      alreadyAnswered = await getUserAnswerForQuestion(fid, nextQuestion.question)
      break
    }

    if (tries === 5) {
      // TODO: add frame that you answered all questions
    }

    return res.redirect(
      307,
      `/frames/question?qi=${questionIndex}&step=${nextStep}`
    )
  }

  // just answered a question
  if ([1, 3, 5].includes(step) && question && buttonClicked) {
    if (buttonClicked === '< Back') {
      const previousOffset = (answerOffset - 4 > 0) ? answerOffset - 4 : 0
      return res.redirect(
        307,
        `/frames/question?qi=${questionIndex}&step=${step}&ioff=${previousOffset}`
      )
    }

    if (buttonClicked === 'More >') {
      return res.redirect(
        307,
        `/frames/question?qi=${questionIndex}&step=${step}&ioff=${answerOffset + 2}`
      )
    }

    const alreadyAnswered = await getUserAnswerForQuestion(fid, question.question)

    if (alreadyAnswered) {
      return res.status(400).end()
    }

    await createUserAnswer({
      fid,
      question: question.question,
      answer: buttonClicked,
      casterFid: fidThatCastedFrame
    })

    return res.redirect(
      307,
      `/frames/results?step=${nextStep}&qi=${questionIndex}&fid=${fid}`
    )
  }

  return res.status(400).end()
}

export default submitFrame
