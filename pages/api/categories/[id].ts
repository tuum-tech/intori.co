import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import * as yup from 'yup'
import {
  deleteCategory,
  createCategory
} from '../../../models/categories'
import {
  deleteQuestionCategoriesByCategoryId
} from '../../../models/questionCategories'
import { isSuperAdmin } from '../../../utils/isSuperAdmin'

const deleteEditAddCategory = async (
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

  if (!['POST', 'DELETE'].includes(req.method as string) || !id) {
    return res.status(405).end()
  }

  if (req.method === 'DELETE') {
    await deleteCategory(id as string)

    await deleteQuestionCategoriesByCategoryId(id as string)

    return res.status(204).end()
  }

  if (req.method === 'POST' && id === "new") {
    try {
      const validBody = await yup.object().shape({
        category: yup.string().required('Category name is required.')
      }).validate(req.body, { stripUnknown: true })

      const category = await createCategory(validBody.category)

      return res.status(201).json(category)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: (err as Error).message })
    }
  }

  return res.status(405).end()
}

export default deleteEditAddCategory
