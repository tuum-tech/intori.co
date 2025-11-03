import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/prisma'
import type { BrandedThirdPartyGiftPreferences, BrandedThirdPartyGiftStatus } from '@prisma/client'
import * as yup from 'yup'

interface UpdateStatusRequest {
  status: BrandedThirdPartyGiftStatus
}

interface UpdateStatusResponse {
  success: boolean
  data?: BrandedThirdPartyGiftPreferences
  error?: string
}

// Validation schema
const updateStatusSchema = yup.object({
  status: yup.string().oneOf(['PENDING', 'APPROVED', 'REJECTED']).required("Status is required")
})

const updateBrandedGiftStatus = async (req: NextApiRequest, res: NextApiResponse<UpdateStatusResponse>) => {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions(req))

    if (!session?.user?.fid || !session?.admin) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const id = req.query.id as string
    if (!id) {
      return res.status(400).json({ success: false, error: 'Branded gift ID is required' })
    }

    // Validate request body using Yup schema
    let validatedBody: UpdateStatusRequest
    try {
      validatedBody = await updateStatusSchema.validate(req.body, { abortEarly: false })
    } catch (validationError: any) {
      const errors = validationError.errors || [validationError.message]
      return res.status(400).json({ 
        success: false, 
        error: `Validation failed: ${errors.join(', ')}` 
      })
    }

    const { status } = validatedBody

    // Check if branded gift exists
    const existingBrandedGift = await prisma.brandedThirdPartyGiftPreferences.findUnique({
      where: { id }
    })

    if (!existingBrandedGift) {
      return res.status(404).json({ 
        success: false, 
        error: 'Branded gift not found' 
      })
    }

    // Update the branded gift status
    const updatedBrandedGift = await prisma.brandedThirdPartyGiftPreferences.update({
      where: { id },
      data: { status: status as BrandedThirdPartyGiftStatus }
    })

    return res.status(200).json({
      success: true,
      data: updatedBrandedGift
    })

  } catch (error) {
    console.error('Error updating branded gift status:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
}

export default updateBrandedGiftStatus
