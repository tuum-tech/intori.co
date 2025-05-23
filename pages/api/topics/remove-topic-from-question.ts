import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma'

export default async function removeTopicFromQuestion(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, topic } = req.body
  if (!question || !topic) {
    return res.status(400).json({ error: 'Missing question or topic' })
  }

  try {
    // Find the question
    const q = await prisma.question.findFirst({
      where: { question },
    })
    if (!q) {
      return res.status(404).json({ error: 'Question not found' })
    }
    // Remove the topic from the topics array
    const updatedTopics = (q.topics || []).filter((t: string) => t !== topic)
    await prisma.question.update({
      where: { id: q.id },
      data: { topics: updatedTopics },
    })
    return res.status(200).json({ success: true, updatedTopics })
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message || 'Internal server error' })
  }
} 
