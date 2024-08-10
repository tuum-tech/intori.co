import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import * as yup from 'yup'
import {
  QuestionType,
  getQuestionById,
  deleteQuestionById,
  updateQuestionById,
  createQuestion
} from '../../../models/questions'

const createGetChannelFrames = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)
  const adminFids = (process.env.ADMIN_FIDS || '').split(',').map((fid) => parseInt(fid, 10))

  if (!adminFids.includes(fid)) {
    return res.status(404).end()
  }

  const id = req.query.id

  if (!['POST', 'PUT', 'DELETE'].includes(req.method as string) || !id) {
    return res.status(405).end()
  }

  if (req.method === 'DELETE') {
    const question = await getQuestionById(id as string)

    if (!question) {
      return res.status(404).end()
    }

    await deleteQuestionById(id as string)

    return res.status(204).end()
  }

  try {
    const validBody = await yup.object().shape({
      id: yup.string().optional(),
      question: yup.string().required(),
      answers: yup.array().of(yup.string()).required(),
      categories: yup.array().of(yup.string()).required(),
      order: yup.number().required()
    }).validate(req.body, { stripUnknown: true })

    if (req.method === "POST" && id === "new") {
      const newQuestion = await createQuestion(validBody as QuestionType)
      console.log('returning:', { newQuestion })
      return res.status(201).json(newQuestion)
    }

    if (req.method === "PUT") {
      await updateQuestionById(id as string, validBody as QuestionType)
      return res.status(200).end()
    }
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message })
  }

  return res.status(405).end()
}

export default createGetChannelFrames
