import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma'
import type { BrandedThirdPartyGiftPreferences } from '@prisma/client'
import { nanoid } from 'nanoid'
import * as yup from 'yup'

interface CreateBrandedGiftRequest {
  giftUrl: string
  message: string
  targetTopic: string
}

interface CreateBrandedGiftResponse {
  success: boolean
  data?: BrandedThirdPartyGiftPreferences
  error?: string
}

// Validation schema matching the frontend form
const createBrandedGiftSchema = yup.object({
  giftUrl: yup.string().url("Invalid URL").required("Required"),
  message: yup.string().max(300, "Message is too long").required("Required"),
  targetTopic: yup.string().required("Required")
})

const createBrandedGift = async (req: NextApiRequest, res: NextApiResponse<CreateBrandedGiftResponse>) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions(req))

    if (!session?.user?.fid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const brandUserFid = Number(session.user.fid)

    // Check if user has sponsor status first
    const sponsorStatus = await prisma.userSponsorStatus.findUnique({
      where: { fid: brandUserFid }
    })

    if (!sponsorStatus) {
      return res.status(403).json({ 
        success: false, 
        error: 'User must be a sponsor to create branded gifts' 
      })
    }

    // Validate and cast request body using Yup schema
    let validatedBody: CreateBrandedGiftRequest
    try {
      validatedBody = await createBrandedGiftSchema.validate(req.body, { abortEarly: false })
    } catch (validationError: any) {
      const errors = validationError.errors || [validationError.message]
      return res.status(400).json({ 
        success: false, 
        error: `Validation failed: ${errors.join(', ')}` 
      })
    }

    const { giftUrl, message, targetTopic } = validatedBody

    // Create the branded gift preference
    const brandedGift = await prisma.brandedThirdPartyGiftPreferences.create({
      data: {
        brandUserFid,
        giftUrl,
        targetTopic,
        createdByFid: brandUserFid,
        message
      }
    })

    return res.status(201).json({
      success: true,
      data: brandedGift
    })

  } catch (error) {
    console.error('Error creating branded gift:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
}

export default createBrandedGift
