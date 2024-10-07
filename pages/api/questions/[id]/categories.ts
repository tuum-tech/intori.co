import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import {
  deleteQuestionCategory,
  addQuestionCategory,
  getQuestionCategories,
  getQuestionsOfCategory,
  getAllQuestionCategories
} from '../../../../models/questionCategories'

const getAddDeleteQuestionCategories = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)

  if (!req.query.id?.toString()) {
    return res.status(404).end()
  }

  const questionId = req.query.id.toString()

  if (req.method === 'GET' && questionId !== 'all') {
    const questionCategories = await getQuestionCategories(questionId)
    return res.status(200).json(questionCategories)
  }

  const givenCategoryId = req.query.categoryId?.toString()

  if (req.method === 'GET' && questionId === 'all' && givenCategoryId) {
    const questionCategories = await getQuestionsOfCategory(givenCategoryId)
    return res.status(200).json(questionCategories)
  }

  if (req.method === 'GET' && questionId === 'all') {
    const questionCategories = await getAllQuestionCategories()
    return res.status(200).json(questionCategories)
  }

  if (!givenCategoryId) {
    return res.status(400).json({
      message: 'categoryId is required'
    })
  }

  const adminFids = (process.env.ADMIN_FIDS || '').split(',').map((fid) => parseInt(fid, 10))

  if (!adminFids.includes(fid)) {
    return res.status(404).end()
  }

  if (req.method === 'DELETE') {
    await deleteQuestionCategory({
      questionId,
      categoryId: givenCategoryId
    })

    return res.status(204).end()
  }

  if (req.method === 'POST') {
    const questionCategory = await addQuestionCategory({
      questionId,
      categoryId: givenCategoryId
    })

    return res.status(201).json(questionCategory)
  }

  return res.status(405).end()
}

export default getAddDeleteQuestionCategories
