import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma'

export default async function getIntoriPlusApplicationStats(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions(req))
  if (!session?.user?.fid || !session?.admin) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const [totalApplicants, approvedCount, pendingCount] = await Promise.all([
      prisma.intoriPlusApplication.count(),
      prisma.intoriPlusApplication.count({
        where: { status: 'APPROVED' }
      }),
      prisma.intoriPlusApplication.count({
        where: { status: 'PENDING' }
      })
    ])

    return res.status(200).json({
      totalApplicants,
      approved: approvedCount,
      pending: pendingCount
    })
  } catch (error) {
    console.error('Error fetching Intori Plus application stats:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
