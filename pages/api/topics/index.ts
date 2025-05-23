import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma'

const getTopics = async (
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

  const questionTopics = await prisma.question.findMany({
    where: {
      deleted: false,
      topics: { isEmpty: false }
    },
    select: { topics: true }
  })

  const topics = questionTopics.filter(q => q.topics?.length).flatMap(q => q.topics)

  // Remove duplicates
  const uniqueTopics = Array.from(new Set(topics))

  // alphabetically sort the topics
  uniqueTopics.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  return res.status(200).json({ topics: uniqueTopics })
}

export default getTopics
