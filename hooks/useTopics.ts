import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface TopicsResponse {
  topics: string[]
}

export const useTopics = () => {
  return useQuery<TopicsResponse, Error>({
    queryKey: ['topics'],
    queryFn: async () => {
      const response = await axios.get('/api/topics')
      return response.data
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
