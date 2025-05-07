import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import * as yup from 'yup'

// models
import { createAnswerUnlockTopic } from '@/models/answerUnlockTopic'

// utils
import { authOptions } from '../../auth/[...nextauth]'
import { isSuperAdmin } from '@/utils/isSuperAdmin'
import { getCsvFromRequest } from '@/utils/csv'

export const config = {
  api: {
    bodyParser: false,
  },
}

// question, answer, unlockTopics
// Do you have kids?, Yes, Has Kids | Parenting
export default async function importAnswerUnlockTopicsCsv(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)

  if (!isSuperAdmin(fid)) {
    return res.status(404).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const records = await getCsvFromRequest(req)

    const csvRowValidation = yup.object({
      question: yup.string().required('question column is required'),
      answer: yup.string().required('answer column is required'),
      unlockTopics: yup.string().required('unlockTopics column is required'),
    })

    const rowErrors: string[] = []

    for (let i = 0; i < records.length; i++) {
      try {
        const row = records[i]
        const newAnswerUnlockTopic = csvRowValidation.validateSync(row, { stripUnknown: true })

        const unlockTopics = newAnswerUnlockTopic.unlockTopics.split('|').map((topic) => topic.trim())

        await createAnswerUnlockTopic({
          question: newAnswerUnlockTopic.question,
          answer: newAnswerUnlockTopic.answer,
          unlockTopics
        })
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          rowErrors.push(`Row ${i + 1}: ${(err.message)}`)
        }
      }
    }

    return res.status(200).json({
      importErrors: rowErrors
    })
  } catch (error) {
    console.error('Error processing CSV:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
