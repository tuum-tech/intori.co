import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import {
  getAllCategories
} from '../../../models/categories'

const getCategories = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const categories = await getAllCategories()

  return res.status(200).json(categories)
}

export default getCategories
