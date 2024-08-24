import type { NextApiRequest } from 'next'
import { IntoriFrameInputType } from './intoriFrameForms'
import { getFrameSessionFromRequest, FrameSessionType } from '../../models/frameSession'
import { QuestionType, getQuestionById } from '../..//models/questions'
import { paginateInputs } from './paginateInputs'
import {
  createFrameQuestionUrl,
  createSubmitAnswerUrl,
  createSkipQuestionUrl
} from '../urls'

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

  const skipButton: IntoriFrameInputType = {
    type: 'button',
    content: 'Skip',
    postUrl: createSkipQuestionUrl({
      questionId: question.id,
      frameSessionId
    })
  }

  const answerInputs = convertAnswersToInputs(question.answers, question.id, answerOffset ?? 0, frameSessionId)
  answerInputs.push(skipButton)

  return paginateInputs({
    inputs: answerInputs,

    currentInputOffset: answerOffset,

    backButtonInput: (previousInputOffset) => ({
      type: 'button',
      content: '< Back',
      postUrl: createFrameQuestionUrl({
        questionId: question.id,
        answerOffset: previousInputOffset,
        frameSessionId
      })
    }),

    moreButtonInput: (nextInputOffset) => ({
      type: 'button',
      content: 'More >',
      postUrl: createFrameQuestionUrl({
        questionId: question.id,
        answerOffset: nextInputOffset,
        frameSessionId
      })
    })
  })
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
