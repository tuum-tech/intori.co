import type { NextApiRequest } from 'next'
import { IntoriFrameInputType } from './intoriFrameForms'
import { getFrameSessionFromRequest, FrameSessionType } from '../../models/frameSession'
import { QuestionType, getQuestionById } from '../..//models/questions'
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

export const determineAllAnswerOffsetsForQuestion = (question: QuestionType, channelId?: string): number[] => {
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

const getNextAnswerOffset = (question: QuestionType, answerOffset: number, channelId?: string): number => {
  const allAnswerOffsets = determineAllAnswerOffsetsForQuestion(question, channelId)
  const currentOffsetIndex = allAnswerOffsets.indexOf(answerOffset)

  const next =  allAnswerOffsets[currentOffsetIndex + 1]

  return next
}

const getBackAnswerOffset = (question: QuestionType, answerOffset: number, channelId?: string): number => {
  if (!answerOffset) {
    return answerOffset
  }
  const allAnswerOffsets = determineAllAnswerOffsetsForQuestion(question, channelId)
  const currentOffsetIndex = allAnswerOffsets.indexOf(answerOffset)

  return allAnswerOffsets[currentOffsetIndex - 1]
}

const convertAnswersToInputs = (
  answers: string[],
  questionId: string, 
  answerOffset: number,
  frameSessionId: string
): IntoriFrameInputType[] => {
  return answers.map((answer) => ({
    type: 'button',
    content: answer,
    postUrl: createSubmitAnswerUrl({
      questionId,
      answerOffset,
      frameSessionId
    })
  })) as IntoriFrameInputType[]
}

export const getFrameInputsBasedOnAnswerOffset = (
  question: QuestionType,
  answerOffset: number,
  frameSession: FrameSessionType
): IntoriFrameInputType[] => {
  const frameSessionId = frameSession.id

  const inputs: IntoriFrameInputType[] = []

  const skipButton: IntoriFrameInputType = {
    type: 'button',
    content: 'Skip',
    postUrl: createSkipQuestionUrl({
      questionId: question.id,
      frameSessionId
    })
  }

  if (!answerOffset) {
    if (question.answers.length <= 3) {
      inputs.push(
        ...convertAnswersToInputs(question.answers, question.id, 0, frameSessionId)
      )

      return inputs
    }

    const firstThreeAnswers = question.answers.slice(0, 3)

    inputs.push(
      ...convertAnswersToInputs(firstThreeAnswers, question.id, 0, frameSessionId)
    )

    inputs.push({
      type: 'button',
      content: 'More >',
      postUrl: createFrameQuestionUrl({
          questionId: question.id,
          answerOffset: getNextAnswerOffset(question, 0, frameSession.channelId),
          frameSessionId
      })
    })

    return inputs
  }

  const isLastFrameOfAnswers = answerOffset + 2 >= question.answers.length

  const previousOffset = getBackAnswerOffset(question, answerOffset, frameSession.channelId)
  inputs.push({
    type: 'button',
    content: '< Back',
    postUrl: createFrameQuestionUrl({
      questionId: question.id,
      answerOffset: previousOffset,
      frameSessionId
    })
  })

  if (!isLastFrameOfAnswers) {
    const nextTwoAnswers = question.answers.slice(answerOffset, answerOffset + 2)

    inputs.push(
      ...convertAnswersToInputs(nextTwoAnswers, question.id, answerOffset, frameSessionId)
    )

    inputs.push({
      type: 'button',
      content: 'More >',
      postUrl: createFrameQuestionUrl({
        questionId: question.id,
        answerOffset: getNextAnswerOffset(question, answerOffset, frameSession.channelId),
        frameSessionId
      })
    })

    return inputs
  }

  const lastAnswers = question.answers.slice(answerOffset)

  inputs.push(
    ...convertAnswersToInputs(lastAnswers, question.id, answerOffset, frameSessionId)
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

  let question: QuestionType | null = null
  let buttonClicked = ''
  const questionId = (req.query.qi ?? '').toString()
  const channelId = (req.query.channelId ?? session?.channelId ?? '').toString() || undefined

  if (req.query.qi && buttonIndexClicked && session) {
    question = await getQuestionById(questionId)

    if (question) {
      const inputs = getFrameInputsBasedOnAnswerOffset(
        question, 
        answerOffset,
        session
      )

      buttonClicked = inputs[buttonIndexClicked - 1].content
    }
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
