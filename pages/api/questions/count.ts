import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { getQuestionsCount } from '../../../models/questions'

import { authOptions } from '../auth/[...nextauth]'
import { isSuperAdmin } from '@/utils/isSuperAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)

  if (!isSuperAdmin(fid)) {
    return res.status(404).end()
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const count = await getQuestionsCount()
    return res.status(200).json({ count })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
