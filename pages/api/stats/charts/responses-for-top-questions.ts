import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { 
  getMostAnsweredQuestions,
  countUserAnswersForQuestion
} from '../../../../models/userAnswers'

const getResponsesForTopQuestions = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(404).end()
    }
    const session = await getSession({ req })
    const channelId = req.query.channelId as string

    if (!session?.user?.fid) {
      return res.status(404).end()
    }

    if (!channelId && !session.admin) {
      return res.status(404).end()
    }

    if (channelId) {
      // TODO: check if getting stats about a channel i am admin for
    }

    const mostAnsweredQuestions = await getMostAnsweredQuestions({
      channelId
    })

    const popularQuestions = mostAnsweredQuestions.map((question) => question.question)

    const responsesForTopQuestions = await Promise.all(
      popularQuestions.map(async (question) => {
        const answers = await countUserAnswersForQuestion(question, { channelId })

        return {
          question,
          answers
        }
      })
    )

    res.status(200).json({
      responsesForTopQuestions
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export default getResponsesForTopQuestions
