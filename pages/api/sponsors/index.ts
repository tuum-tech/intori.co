import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma'

const getSponsors = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions(req))

    if (!session?.user?.fid || !session?.admin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get all sponsors
    const sponsors = await prisma.userSponsorStatus.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json(sponsors)
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default getSponsors
