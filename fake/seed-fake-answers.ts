import { getAvailableQuestions } from '../utils/frames/questions'
import { createUserAnswer, CreateUserAnswerType } from '../models/userAnswers'

const TOTAL = 10

export const seedFakeAnswers = async () => {
  const intoriQuestions = getAvailableQuestions()
  for (let i = 0; i < TOTAL; i++) {
    const randomQuestion = intoriQuestions[Math.floor(Math.random() * intoriQuestions.length)]

    const userAnswer: CreateUserAnswerType = {
      fid: Math.floor(Math.random() * (470223)) + 1,
      question: randomQuestion.question,
      answer: randomQuestion.answers[Math.floor(Math.random() * randomQuestion.answers.length)],
      casterFid: Math.floor(Math.random() * (470223)) + 1,
      channelId: null
    }

    await createUserAnswer(userAnswer)
  }
}
