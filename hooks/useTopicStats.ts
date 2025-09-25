import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface TopicStats {
  topic: string
  usersUnlocked: number
  averageSpamScore: number
}

export const useTopicStats = (topic: string) => {
  return useQuery<TopicStats, Error>({
    queryKey: ['topicStats', topic],
    queryFn: async () => {
      const response = await axios.get(`/api/topics/stats?topic=${encodeURIComponent(topic)}`)
      return response.data
    },
    enabled: !!topic, // Only run query if topic is provided
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
