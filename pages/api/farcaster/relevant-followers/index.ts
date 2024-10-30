import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { getRelevantFollowers } from '../../../../utils/neynarApi' 

// Get if any members or moderators follow this potential member
const getRelevantFollowersBetweenMeAndUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session?.user?.fid) {
    return res.status(403).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  if (!req.query.fid) {
    return res.status(404).json({
      error: 'A target FID is required'
    })
  }

  const targetFid = parseInt(req.query.fid as string, 10)
  const viewerFid = parseInt(session.user.fid, 10)

  const relevantFollowers = await getRelevantFollowers({
    targetFid,
    viewerFid
  })

  return res.status(200).json(relevantFollowers)
}

export default getRelevantFollowersBetweenMeAndUser
