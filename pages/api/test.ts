import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth"
import { intoriQuestions } from '../../utils/frames/intoriFrameForms'
import { createUserAnswer, CreateUserAnswerType } from '../../models/userAnswers'
import { authOptions } from "./auth/[...nextauth]"

const createFakeAnswers = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (
    !process.env.NEXTAUTH_URL ||
    !process.env.NEXTAUTH_URL.startsWith('http://localhost')
  ) {
    return res.status(404).end()
  }

  if (req.method !== 'GET') {
    return res.status(404).end()
  }

  const session = await getServerSession(req, res, authOptions(req))

  if (!session?.user?.fid) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)

  const TOTAL = 3
  for (let i = 0; i < TOTAL; i++) {
    const randomQuestion = intoriQuestions[Math.floor(Math.random() * intoriQuestions.length)]

    const userAnswer: CreateUserAnswerType = {
      fid,
      question: randomQuestion.question,
      answer: randomQuestion.answers[Math.floor(Math.random() * randomQuestion.answers.length)],
      casterFid: 294394 // intori user fid
    }

    await createUserAnswer(userAnswer)
  }

  return res.send(`
    <h1>Success!</h1>
    <p> Go to <a href="/responses">/responses</a> to see fake answers generated for you.</p>
  `)
}

export default createFakeAnswers
