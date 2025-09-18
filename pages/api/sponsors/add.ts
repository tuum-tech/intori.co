import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma'

const addSponsor = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions(req))

    if (!session?.user?.fid || !session?.admin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { fid } = req.body

    if (!fid || typeof fid !== 'number') {
      return res.status(400).json({ error: 'FID is required and must be a number' })
    }

    // Check if user is already a sponsor
    const existingSponsor = await prisma.userSponsorStatus.findUnique({
      where: { fid }
    })

    if (existingSponsor) {
      return res.status(409).json({ error: 'User is already a sponsor' })
    }

    // Create new sponsor record
    const newSponsor = await prisma.userSponsorStatus.create({
      data: {
        fid,
        createdAt: new Date()
      }
    })

    return res.status(201).json(newSponsor)
  } catch (error) {
    console.error('Error adding sponsor:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default addSponsor
