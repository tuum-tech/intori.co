import { intoriFrameForms } from '../utils/frames/intoriFrameForms'
import { createUserAnswer, CreateUserAnswerType } from '../models/userAnswers'

const TOTAL = 100

export const seedFakeAnswers = async () => {
  for (let i = 0; i < TOTAL; i++) {
    const sequenceKeys = Object.keys(intoriFrameForms)
    const randomSequence = sequenceKeys[Math.floor(Math.random() * sequenceKeys.length)]

    const form = intoriFrameForms[randomSequence]
    const step = form.steps[Math.floor(Math.random() * form.steps.length)]

    const userAnswer: CreateUserAnswerType = {
      fid: Math.floor(Math.random() * (470223)) + 1,
      sequence: form.name,
      question: step.question as string,
      answer: step.inputs[Math.floor(Math.random() * step.inputs.length)].content
    }

    await createUserAnswer(userAnswer)
  }
}
