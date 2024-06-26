
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import {
  getBlockchainSettingsForUser,
  updateBlockchainSettingsForUser
} from '../../models/userBlockchainSettings'

const getPutSettings = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!['GET', 'PUT'].includes(req.method ?? '')) {
    return res.status(405).end()
  }

  const session = await getServerSession(req, res, authOptions(req))

  if (!session?.user?.fid) {
    return res.status(401).end()
  }

  const fid = parseInt(session.user.fid, 10)

  if (req.method === 'PUT') {
    if (!req.body || req.body.autoPublish === undefined) {
      return res.status(400).json({ error: 'autoPublish(boolean) is required' })
    }

    const settings = await updateBlockchainSettingsForUser(
      fid,
      {
        autoPublish: Boolean(req.body.autoPublish)
      }
    )

    return res.status(200).json(settings)
  }

  const settings = await getBlockchainSettingsForUser(fid)

  res.status(200).json(settings)
}

export default getPutSettings
