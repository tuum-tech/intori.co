import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma'
import type { BrandedThirdPartyGiftPreferences } from '@prisma/client'

interface GetBrandedGiftsResponse {
  success: boolean
  data?: BrandedThirdPartyGiftPreferences[]
  error?: string
}

const getBrandedGifts = async (req: NextApiRequest, res: NextApiResponse<GetBrandedGiftsResponse>) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions(req))

    if (!session?.user?.fid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const userFid = Number(session.user.fid)
    const isAdmin = session.admin

    // If admin, get all branded gifts. If not admin, get only user's branded gifts
    const whereClause = isAdmin 
      ? {} 
      : { brandUserFid: userFid }

    const brandedGifts = await prisma.brandedThirdPartyGiftPreferences.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      data: brandedGifts
    })

  } catch (error) {
    console.error('Error fetching branded gifts:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
}

export default getBrandedGifts
