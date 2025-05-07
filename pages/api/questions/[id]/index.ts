import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { isSuperAdmin } from '../../../../utils/isSuperAdmin'
import {
  getQuestionById,
  deleteQuestionById,
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

  if (req.method === 'DELETE') {
    const question = await getQuestionById(id as string)

    if (!question) {
      return res.status(404).end()
    }

    await deleteQuestionById(id as string)

    return res.status(204).end()
  }

  return res.status(405).end()
}

export default deleteEditAddQuestion
