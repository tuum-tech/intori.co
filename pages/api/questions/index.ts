import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { getAllQuestions } from '../../../models/questions'

const getQuestions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  if (req.method !== 'GET') {
    return res.status(404).end()
  }

  if (!req.query.category) {
    return res.status(400).json({
      error: 'Category is required'
    })
  }

  const questions = await getAllQuestions({
    category: (req.query.category).toString()
  })

  return res.status(200).json(questions)
}

export default getQuestions
