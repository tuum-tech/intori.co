import type { NextApiRequest } from 'next'
import { intoriQuestions, IntoriFrameInputType } from './intoriFrameForms'
import {
  createFrameQuestionUrl,
  createSubmitAnswerUrl
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

// question: { question: string, answers: string[] }
const determineAllAnswerOffsetsForQuestion = (questionIndex: number): number[] => {
  const question = intoriQuestions[questionIndex]
  const answerOffsets: number[] = [0]

  if (question.answers.length <= 3) {
    return answerOffsets
  }

  answerOffsets.push(3)

  while (answerOffsets[answerOffsets.length - 1] + 3 < question.answers.length) {
    answerOffsets.push(
      answerOffsets[answerOffsets.length - 1] + 2
    )
  }

  answerOffsets.push(
    question.answers.length - 1 - answerOffsets[answerOffsets.length - 1]
    
  )
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
  frameSessionId: string
): IntoriFrameInputType[] => {
  const question = intoriQuestions[questionIndex]
  const inputs: IntoriFrameInputType[] = []

  const skipButton: IntoriFrameInputType = {
    type: 'button',
    content: 'Skip',
    postUrl: createSubmitAnswerUrl({
      questionIndex,
      answerOffset,
      frameSessionId
    })
  }

  if (!answerOffset) {
    // TODO: add skip
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

  const isLastFrameOfAnswers = answerOffset + 3 >= question.answers.length

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

  // TODO: append skip to last group of answers

  const lastAnswers = question.answers.slice(answerOffset)

  inputs.push(
    ...convertAnswersToInputs(lastAnswers, questionIndex, answerOffset, frameSessionId)
  )

  return inputs
}

export const frameSubmissionHelpers = (req: NextApiRequest) => {
  const fid = req.body.untrustedData.fid
  const fidThatCastedFrame = req.body.untrustedData.castId.fid
  const step = parseInt(req.query.step?.toString() || '0') ?? 0
  const answerOffset = parseInt(req.query.ioff?.toString() || '0') ?? 0
  const currentSequenceStep = parseInt(req.query.step?.toString() || '0') ?? 0
  const referrer = req.body.untrustedData.url as string
  const buttonIndexClicked = req.body.untrustedData.buttonIndex
  const frameSessionId = req.query.fsid?.toString() || ''

  let question: typeof intoriQuestions[0] | null = null
  let buttonClicked = ''
  const questionIndex = parseInt(req.query.qi?.toString() || '0') ?? 0

  if (req.query.qi && buttonIndexClicked) {
    question = intoriQuestions[questionIndex]
    const inputs = getFrameInputsBasedOnAnswerOffset(
      questionIndex, 
      answerOffset,
      frameSessionId
    )

    buttonClicked = inputs[buttonIndexClicked - 1].content
  }

  return {
    fidThatCastedFrame,
    fid,
    step,
    buttonClicked,
    question,
    questionIndex,
    currentSequenceStep,
    referrer,
    answerOffset,
    frameSessionId
  }
}
