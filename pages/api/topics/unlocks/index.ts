import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/prisma'

const getQuestionThatUnlockTopic = async (
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

  const topicToLookup = (req.query.topic ?? "").toString()
  if (!topicToLookup) {
    return res.status(400).json({
      error: 'Question is required'
    })
  }

  const questionAnswersThatUnlockTopic = await prisma.answerUnlockTopic.findMany({
    where: {
      unlockTopics: {
        has: topicToLookup
      }
    },
    select: { question: true, answer: true }
  })

  return res.status(200).json({
    questionAnswersThatUnlockTopic
  })
}

export default getQuestionThatUnlockTopic
