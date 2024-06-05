import type { NextApiRequest } from 'next'
import { intoriQuestions, IntoriFrameInputType } from './intoriFrameForms'

export const frameQuestionUrl = (params: {
  questionIndex: number,
  answerOffset?: number
}): string => {
  const { questionIndex, answerOffset } = params

  return `${process.env.NEXTAUTH_URL}/frames/question?qi=${questionIndex}&ioff=${answerOffset ?? 0}`
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
        ...question.answers.map((answer) => ({
          type: 'button',
          content: answer
        })) as IntoriFrameInputType[]
      )

      return inputs
    }

    const firstThreeAnswers = question.answers.slice(0, 3)

    inputs.push(
      ...firstThreeAnswers.map((answer) => ({
        type: 'button',
        content: answer
      })) as IntoriFrameInputType[]
    )

    inputs.push({
      type: 'button',
      content: 'More >',
      action: 'link',
      target: frameQuestionUrl({ questionIndex, answerOffset: 4 })
    })

    return inputs
  }

  const previousOffset = (answerOffset - 4 > 0) ? answerOffset - 4 : 0

  inputs.push({
    type: 'button',
    content: '< Back',
    action: 'link',
    target: frameQuestionUrl({ questionIndex, answerOffset: previousOffset })
  })

  const isLastFrameOfAnswers = answerOffset + 3 >= question.answers.length

  if (!isLastFrameOfAnswers) {
    const nextTwoAnswers = question.answers.slice(answerOffset, answerOffset + 2)

    inputs.push(
      ...nextTwoAnswers.map((answer) => ({
        type: 'button',
        content: answer
      })) as IntoriFrameInputType[]
    )

    inputs.push({
      type: 'button',
      content: 'More >',
      action: 'link',
      target: frameQuestionUrl({ questionIndex, answerOffset: answerOffset + 2 })
    })

    return inputs
  }

  const lastAnswers = question.answers.slice(answerOffset)

  inputs.push(
    ...lastAnswers.map((answer) => ({
      type: 'button',
      content: answer
    })) as IntoriFrameInputType[]
  )

  return inputs
}

export const frameSubmissionHelpers = (req: NextApiRequest) => {
  const fid = req.body.untrustedData.fid
  const fidThatCastedFrame = req.body.untrustedData.castId.fid
  const step = parseInt(req.query.step?.toString() || '0') ?? 0
  const questionIndex = parseInt(req.query.qi?.toString() || '0') ?? 0
  const question = intoriQuestions[questionIndex]
  const answerOffset = parseInt(req.query.ioff?.toString() || '0') ?? 0
  const currentSequenceStep = parseInt(req.query.step?.toString() || '0') ?? 0
  const referrer = req.body.untrustedData.url as string

  let buttonClicked = ''

  if (question) {
    const buttonIndexClicked = req.body.untrustedData.buttonIndexClicked
    const inputs = getFrameInputsBasedOnAnswerOffset(questionIndex, answerOffset)

    console.log({
      question,
      buttonIndexClicked,
      questionIndex,
      answerOffset,
      inputs,
      buttonClicked
    })

    buttonClicked = inputs[buttonIndexClicked].content

    if (['< Back', 'More >'].includes(buttonClicked)) {
      buttonClicked = ''
    }
  }

  return {
    fidThatCastedFrame,
    fid,
    step,
    buttonClicked,
    question,
    currentSequenceStep,
    referrer
  }
}
