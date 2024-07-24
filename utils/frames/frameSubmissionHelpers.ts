import type { NextApiRequest } from 'next'
import { IntoriFrameInputType } from './intoriFrameForms'
import { getAvailableQuestions, IntoriQuestionType } from './questions' 
import { getFrameSessionFromRequest, FrameSessionType } from '../../models/frameSession'
import {
  createFrameQuestionUrl,
  createSubmitAnswerUrl,
  createSkipQuestionUrl
} from './generatePageUrls'

export type FarcasterFrameSubmitBodyType = {
  untrustedData: {
    fid: number,
    url: string, // like referrer url
    messageHash: string,
    timestamp: number,
    network: number,
    buttonIndex: number,
    castId: { fid: number, hash: string }
  },
  trustedData: {
    messageBytes: string
  }
}

export const determineAllAnswerOffsetsForQuestion = (questionIndex: number, channelId?: string): number[] => {
  const questions = getAvailableQuestions({ channelId })
  const question = questions[questionIndex]
  const answerOffsets: number[] = [0]

  if (question.answers.length <= 3) {
    return answerOffsets
  }

  answerOffsets.push(3)

  // for next pages, will always show '< back' [answer 1, answer 2] ('More >' or 'Skip')
  while (answerOffsets[answerOffsets.length - 1] + 2 < question.answers.length) {
    answerOffsets.push(
      answerOffsets[answerOffsets.length - 1] + 2
    )
  }

  // answerOffsets.push(
  //   question.answers.length - 1 - answerOffsets[answerOffsets.length - 1]
  //   
  // )
  return answerOffsets
}

const getNextAnswerOffset = (questionIndex: number, answerOffset: number): number => {
  const allAnswerOffsets = determineAllAnswerOffsetsForQuestion(questionIndex)
  const currentOffsetIndex = allAnswerOffsets.indexOf(answerOffset)

  return allAnswerOffsets[currentOffsetIndex + 1]
}

const getBackAnswerOffset = (questionIndex: number, answerOffset: number): number => {
  if (!answerOffset) {
    return answerOffset
  }
  const allAnswerOffsets = determineAllAnswerOffsetsForQuestion(questionIndex)
  const currentOffsetIndex = allAnswerOffsets.indexOf(answerOffset)

  return allAnswerOffsets[currentOffsetIndex - 1]
}

const convertAnswersToInputs = (
  answers: string[],
  questionIndex: number, 
  answerOffset: number,
  frameSessionId: string
): IntoriFrameInputType[] => {
  return answers.map((answer) => ({
    type: 'button',
    content: answer,
    postUrl: createSubmitAnswerUrl({
      questionIndex,
      answerOffset,
      frameSessionId
    })
  })) as IntoriFrameInputType[]
}

export const getFrameInputsBasedOnAnswerOffset = (
  questionIndex: number,
  answerOffset: number,
  frameSession: FrameSessionType
): IntoriFrameInputType[] => {
  const frameSessionId = frameSession.id

  const question = getAvailableQuestions({
    channelId: frameSession.channelId
  })[questionIndex]

  const inputs: IntoriFrameInputType[] = []

  const skipButton: IntoriFrameInputType = {
    type: 'button',
    content: 'Skip',
    postUrl: createSkipQuestionUrl({
      questionIndex,
      frameSessionId
    })
  }

  if (!answerOffset) {
    if (question.answers.length <= 3) {
      inputs.push(
        ...convertAnswersToInputs(question.answers, questionIndex, 0, frameSessionId)
      )

      return inputs
    }

    const firstThreeAnswers = question.answers.slice(0, 3)

    inputs.push(
      ...convertAnswersToInputs(firstThreeAnswers, questionIndex, 0, frameSessionId)
    )

    inputs.push({
      type: 'button',
      content: 'More >',
      postUrl: createFrameQuestionUrl({
          questionIndex,
          answerOffset: getNextAnswerOffset(questionIndex, 0),
          frameSessionId
      })
    })

    return inputs
  }

  const isLastFrameOfAnswers = answerOffset + 2 >= question.answers.length

  const previousOffset = getBackAnswerOffset(questionIndex, answerOffset)
  inputs.push({
    type: 'button',
    content: '< Back',
    postUrl: createFrameQuestionUrl({
      questionIndex,
      answerOffset: previousOffset,
      frameSessionId
    })
  })

  if (!isLastFrameOfAnswers) {
    const nextTwoAnswers = question.answers.slice(answerOffset, answerOffset + 2)

    inputs.push(
      ...convertAnswersToInputs(nextTwoAnswers, questionIndex, answerOffset, frameSessionId)
    )

    inputs.push({
      type: 'button',
      content: 'More >',
      postUrl: createFrameQuestionUrl({
        questionIndex,
        answerOffset: getNextAnswerOffset(questionIndex, answerOffset),
        frameSessionId
      })
    })

    return inputs
  }

  const lastAnswers = question.answers.slice(answerOffset)

  inputs.push(
    ...convertAnswersToInputs(lastAnswers, questionIndex, answerOffset, frameSessionId)
  )

  inputs.push(skipButton)

  return inputs
}

export const frameSubmissionHelpers = async (req: NextApiRequest) => {
  const fid = req.body.untrustedData.fid
  const fidThatCastedFrame = req.body.untrustedData.castId.fid
  const answerOffset = parseInt(req.query.ioff?.toString() || '0') ?? 0
  const buttonIndexClicked = req.body.untrustedData.buttonIndex
  const session = await getFrameSessionFromRequest(req)

  let question: IntoriQuestionType | undefined = undefined
  let buttonClicked = ''
  const questionIndex = parseInt(req.query.qi?.toString() || '0') ?? 0
  const channelId = req.query.channelId ? req.query.channelId.toString() : undefined

  if (req.query.qi && buttonIndexClicked && session) {
    const availableQuestions = getAvailableQuestions({ channelId: session?.channelId })

    question = availableQuestions[questionIndex]

    const inputs = getFrameInputsBasedOnAnswerOffset(
      questionIndex, 
      answerOffset,
      session
    )

    buttonClicked = inputs[buttonIndexClicked - 1].content
  }

  return {
    fidThatCastedFrame,
    fid,
    buttonClicked,
    question,
    session,
    channelId
  }
}
