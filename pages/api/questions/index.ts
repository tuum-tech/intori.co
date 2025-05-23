import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { getPaginatedQuestions } from '../../../models/questions'

const getQuestions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const limit = parseInt(req.query.limit as string) || 20
  const skip = parseInt(req.query.skip as string) || 0
  const search = req.query.search as string | undefined
  const byTopic = req.query.byTopic as string | undefined

  const { questions, total } = await getPaginatedQuestions({ limit, skip, search, byTopic })

  return res.status(200).json({
    questions,
    total
  })
}

export default getQuestions
