import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma'

const getTopicStats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions(req))

    if (!session?.user?.fid) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { topic } = req.query

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic parameter is required' })
    }

    // Get all users who have unlocked this topic
    const usersWithTopic = await prisma.userUnlockedTopic.findMany({
      where: { topic },
      select: { fid: true }
    })

    const userIds = usersWithTopic.map(user => user.fid)

    if (userIds.length === 0) {
      return res.status(200).json({
        topic,
        usersUnlocked: 0,
        averageSpamScore: 0
      })
    }

    // Get spam scores for these users
    const spamScores = await prisma.spamScore.findMany({
      where: {
        fid: { in: userIds }
      },
      select: { score: true }
    })

    // Calculate average spam score
    const totalScore = spamScores.reduce((sum, record) => sum + record.score, 0)
    const averageSpamScore = spamScores.length > 0 ? totalScore / spamScores.length : 0

    return res.status(200).json({
      topic,
      usersUnlocked: userIds.length,
      averageSpamScore: Math.round(averageSpamScore * 100) / 100 // Round to 2 decimal places
    })
  } catch (error) {
    console.error('Error fetching topic stats:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default getTopicStats
