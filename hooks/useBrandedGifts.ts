import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { BrandedThirdPartyGiftPreferences } from '@prisma/client'

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

export const useCreateBrandedGift = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateBrandedGiftResponse, Error, CreateBrandedGiftRequest>({
    mutationFn: async (data: CreateBrandedGiftRequest) => {
      const response = await axios.post('/api/branded-gifts/create', data)
      return response.data
    },
    onSuccess: () => {
      // Invalidate any branded gifts queries if they exist
      queryClient.invalidateQueries({ queryKey: ['brandedGifts'] })
    },
    onError: (error: any) => {
      console.error('Failed to create branded gift:', error)
    }
  })
}
