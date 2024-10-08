import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { fetchUserDetailsByFids } from '../../../../utils/neynarApi'

const getFarcasterUserDetails = async (
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

  const fid = parseInt(req.query?.fid?.toString() || '', 10)

  if (!fid) {
    return res.status(400).end()
  }

  const details = await fetchUserDetailsByFids([fid])

  if (!details.length) {
    return res.status(404).end()
  }

  // cache for 7 days
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')

  return res.status(200).json(details[0])
}

export default getFarcasterUserDetails
