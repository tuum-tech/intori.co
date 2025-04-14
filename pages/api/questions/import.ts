import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { v4 as uuid } from 'uuid'
import { parse } from 'csv-parse/sync'
import formidable from 'formidable'
import * as yup from 'yup'
import fs from 'fs'

// models
import { getQuestionByQuestionText, createQuestion } from '@/models/questions'
import { doesCategoryExist, getCategoryByName, createCategory } from '@/models/categories'
import { addQuestionCategory } from '@/models/questionCategories'

// utils
import { authOptions } from '../auth/[...nextauth]'
import { isSuperAdmin } from '@/utils/isSuperAdmin'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function importQuestionsHandler(
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
    // Parse the form data
    const form = formidable()
    const uploadedResult = await form.parse(req)
    const files = uploadedResult[1]

    if (!files.csv) {
      return res.status(400).json({ error: 'CSV file is required' })
    }

    const csvFile = files.csv[0]
    if (!csvFile.mimetype?.includes('csv')) {
      return res.status(400).json({ error: 'File must be a CSV' })
    }

    // Read and parse the CSV file
    const csvContent = fs.readFileSync(csvFile.filepath, 'utf-8')
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    })

    const csvRowValidation = yup.object({
      question: yup.string().required('Question is required'),
      answers: yup.string().required('Answers are required'),
      categories: yup.string().required('Categories are required'),
    })

    const rowErrors: string[] = []
    let newQuestions = 0

    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      try {
        const questionData = csvRowValidation.validateSync(row, { stripUnknown: true })
        const questionExists = await getQuestionByQuestionText(questionData.question)

        if (questionExists) {
          rowErrors.push(`Row ${i + 1}: Question "${questionData.question}" already exists`)
          continue
        }

        const answers = questionData.answers.split('|').map((answer: string) => answer.trim())
        const categories = questionData.categories.split('|').map((category: string) => category.trim())
        console.log(questionData.question, answers, categories)

        const newQuestion = await createQuestion({
          id: uuid(),
          question: questionData.question,
          answers,
          order: i
        })

        console.log('new question id', newQuestion.id)
        newQuestions++

        for (let j = 0; j < categories.length; j++) {
          const category = categories[j]
          const categoryExists = await doesCategoryExist(category)
          let categoryId = ""

          if (!categoryExists) {
            const newCat = await createCategory(category)
            categoryId = newCat.id
          } else {
            const cat = await getCategoryByName(category)
            if (cat) {
              categoryId = cat.id
            }
          }

          console.log({
            questionId: newQuestion.id,
            categoryId,
          })
          await addQuestionCategory({
            questionId: newQuestion.id,
            categoryId,
          })
        }
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          rowErrors.push(`Row ${i + 1}: ${(err.message)}`)
        } else {
          console.error(err)
        }
      }
    }

    // Clean up the uploaded file
    fs.unlinkSync(csvFile.filepath)

    return res.status(200).json({
      questionsCount: newQuestions,
      importErrors: rowErrors
    })
  } catch (error) {
    console.error('Error processing CSV:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
