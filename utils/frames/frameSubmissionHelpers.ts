import type { NextApiRequest } from 'next'
import { intoriQuestions, IntoriFrameInputType } from './intoriFrameForms'

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

export const frameQuestionUrl = (params: {
  questionIndex: number,
  answerOffset?: number
}): string => {
  const { questionIndex, answerOffset } = params

  return `${process.env.NEXTAUTH_URL}/frames/question?qi=${questionIndex}&ioff=${answerOffset ?? 0}`
}

// question: { question: string, answers: string[] }
const determineAllAnswerOffsetsForQuestion = (questionIndex: number): number[] => {
  const question = intoriQuestions[questionIndex]
  const answerOffsets: number[] = [0]

  if (question.answers.length <= 4) {
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

const convertAnswersToInputs = (answers: string[], questionIndex: number): IntoriFrameInputType[] => {
  const submitAnswerPostUrl = `${process.env.NEXTAUTH_URL}/api/frames/answer?qi=${questionIndex}`

  return answers.map((answer) => ({
    type: 'button',
    content: answer,
    postUrl: submitAnswerPostUrl
  })) as IntoriFrameInputType[]
}

export const getFrameInputsBasedOnAnswerOffset = (
  questionIndex: number,
  answerOffset: number
): IntoriFrameInputType[] => {
  const question = intoriQuestions[questionIndex]
  const inputs: IntoriFrameInputType[] = []

  if (!answerOffset) {
    if (question.answers.length <= 4) {
      inputs.push(
        ...convertAnswersToInputs(question.answers, questionIndex)
      )

      return inputs
    }

    const firstThreeAnswers = question.answers.slice(0, 3)

    inputs.push(
      ...convertAnswersToInputs(firstThreeAnswers, questionIndex)
    )

    inputs.push({
      type: 'button',
      content: 'More >',
      postUrl: frameQuestionUrl({
          questionIndex,
          answerOffset: getNextAnswerOffset(questionIndex, answerOffset)
      })
    })

    return inputs
  }

  const isLastFrameOfAnswers = answerOffset + 3 >= question.answers.length

  const previousOffset = getBackAnswerOffset(questionIndex, answerOffset)
  inputs.push({
    type: 'button',
    content: '< Back',
    postUrl: frameQuestionUrl({ questionIndex, answerOffset: previousOffset })
  })

  if (!isLastFrameOfAnswers) {
    const nextTwoAnswers = question.answers.slice(answerOffset, answerOffset + 2)

    inputs.push(
      ...convertAnswersToInputs(nextTwoAnswers, questionIndex)
    )

    inputs.push({
      type: 'button',
      content: 'More >',
      postUrl: frameQuestionUrl({
        questionIndex,
        answerOffset: getNextAnswerOffset(questionIndex, answerOffset)
      })
    })

    return inputs
  }

  const lastAnswers = question.answers.slice(answerOffset)

  inputs.push(
    ...convertAnswersToInputs(lastAnswers, questionIndex)
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

  let question: typeof intoriQuestions[0] | null = null
  let buttonClicked = ''
  const questionIndex = parseInt(req.query.qi?.toString() || '0') ?? 0

  if (req.query.qi) {
    question = intoriQuestions[questionIndex]
    const buttonIndexClicked = req.body.untrustedData.buttonIndexClicked
    const inputs = getFrameInputsBasedOnAnswerOffset(questionIndex, answerOffset)

    buttonClicked = inputs[buttonIndexClicked].content
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
    answerOffset
  }
}
