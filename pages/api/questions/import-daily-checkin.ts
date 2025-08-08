import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import * as yup from 'yup'

// utils
import { authOptions } from '../auth/[...nextauth]'
import { isSuperAdmin } from '@/utils/isSuperAdmin'
import { getCsvFromRequest } from '@/utils/csv'
import { prisma } from '@/prisma'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function importDailyCheckInQuestionsHandler(
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
      question: yup.string().required('Question is required'),
      answers: yup.string().required('Answers are required'),
    })

    const rowErrors: string[] = []
    let newQuestions = 0

    // Process all rows in parallel
    await Promise.all(records.map(async (row, i) => {
      try {
        const questionData = csvRowValidation.validateSync(row, { stripUnknown: true })
        
        // Check if question already exists
        const questionExists = await prisma.dailyCheckInQuestion.findFirst({
          where: { question: questionData.question }
        })

        if (questionExists) {
          rowErrors.push(`Row ${i + 1}: Question "${questionData.question}" already exists`)
          return
        }

        const answers = questionData.answers.split('|').map((answer: string) => answer.trim())

        await prisma.dailyCheckInQuestion.create({
          data: {
            question: questionData.question,
            answers
          }
        })

        newQuestions++
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          rowErrors.push(`Row ${i + 1}: ${(err.message)}`)
        } else if (err instanceof Error) {
          rowErrors.push(`Row ${i + 1}: ${(err.message)}`)
        }
        console.error(err)
      }
    }))

    return res.status(200).json({
      questionsCount: newQuestions,
      importErrors: rowErrors
    })
  } catch (error) {
    console.error('Error processing CSV:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
