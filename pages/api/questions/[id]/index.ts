import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { isSuperAdmin } from '../../../../utils/isSuperAdmin'
import * as yup from 'yup'
import {
  QuestionType,
  getQuestionById,
  deleteQuestionById,
  updateQuestionById,
  createQuestion,
  questionAlreadyExists
} from '../../../../models/questions'

const deleteEditAddQuestion = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)

  if (!isSuperAdmin(fid)) {
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

    console.log('here deleting', id)
    await deleteQuestionById(id as string)

    return res.status(204).end()
  }

  try {
    const validBody = await yup.object().shape({
      id: yup.string().uuid().required(),
      question: yup.string().required(),
      answers: yup.array().of(yup.string()).required(),
      order: yup.number().required()
    }).validate(req.body, { stripUnknown: true })

    const alreadyExists = await questionAlreadyExists({
      question: validBody.question,
      excludeQuestionId: id === 'new' ? undefined : id as string
    })

    if (alreadyExists) {
      return res.status(400).json({
        error: 'Question already exists'
      })
    }

    if (req.method === "POST" && id === "new") {
      const newQuestion = await createQuestion(validBody as QuestionType)
      console.log('returning:', { newQuestion })
      return res.status(201).json(newQuestion)
    }

    if (req.method === "PUT") {
      const new = await updateQuestionById(id as string, validBody as QuestionType)
      return res.status(200).json(new)
    }
  } catch (err) {
    console.error(err)
    return res.status(400).json({ error: (err as Error).message })
  }

  return res.status(405).end()
}

export default deleteEditAddQuestion
