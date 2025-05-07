import type { NextApiRequest, NextApiResponse } from 'next'
import { getAnswerUnlockTopic } from '../../models/answerUnlockTopic'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question } = req.query

  if (!question) {
    return res.status(400).json({ error: 'Missing required parameters: question and answer' })
  }

  try {
    const result = await getAnswerUnlockTopic({
      question: question.toString()
    })

    if (!result) {
      return res.status(404).json({ error: 'No unlock topics found for this question/answer' })
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
