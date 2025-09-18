import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface AddSponsorRequest {
  fid: number
}

interface UserSponsorStatus {
  fid: number
  createdAt: string
}

export const useSponsors = () => {
  return useQuery<UserSponsorStatus[], Error>({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const response = await axios.get('/api/sponsors')
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useAddSponsor = () => {
  const queryClient = useQueryClient()

  return useMutation<UserSponsorStatus, Error, AddSponsorRequest>({
    mutationFn: async ({ fid }: AddSponsorRequest) => {
      const response = await axios.post('/api/sponsors/add', { fid })
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch sponsors list
      queryClient.invalidateQueries({ queryKey: ['sponsors'] })
    },
    onError: (error: any) => {
      console.error('Failed to add sponsor:', error)
    }
  })
}
