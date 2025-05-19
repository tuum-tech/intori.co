import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type AnswerUnlockTopic } from '@prisma/client'

export const useAnswerUnlockTopic = (params: { question: string }) => {
  const { question } = params
  return useQuery<AnswerUnlockTopic[] | null>({
    queryKey: ['answer-unlock-topic', question],
    queryFn: async () => {
      if (!question) return null
      const { data } = await axios.get<AnswerUnlockTopic[]>(
        `/api/answer-unlock-topic?question=${encodeURIComponent(question)}`
      )
      return data
    },
    enabled: !!question,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  })
} 
