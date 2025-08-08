import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/prisma'
import type { Prisma } from '@prisma/client'

const getDailyCheckInQuestions = async (
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

  const where: Prisma.DailyCheckInQuestionWhereInput = {}
  
  if (search) {
    where.question = {
      contains: search,
      mode: "insensitive"
    }
  }

  const [questions, total] = await Promise.all([
    prisma.dailyCheckInQuestion.findMany({
      where,
      take: limit,
      skip: skip,
      orderBy: {
        question: 'asc'
      }
    }),
    prisma.dailyCheckInQuestion.count({
      where
    })
  ])

  return res.status(200).json({
    questions,
    total
  })
}

export default getDailyCheckInQuestions
