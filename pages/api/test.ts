import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllQuestions } from '../../models/questions'
import { addQuestionCategory, deleteAllQuestionCategories } from '../../models/questionCategories'
import { createCategory, getCategoryByName, CategoryType } from '../../models/categories'

const test = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  await deleteAllQuestionCategories()
  const questions = await getAllQuestions()

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    for (let j = 0; j < question.categories.length; j++) {
      const categoryName = question.categories[j]

      let category: CategoryType
      try {
        category = await createCategory(categoryName)
      } catch (err) {
        category = await getCategoryByName(categoryName)
      }

      await addQuestionCategory({
        questionId: question.id,
        categoryId: category.id
      })
    }
  }

  res.status(200).send('<h1>Done</h1>')
}

export default test
