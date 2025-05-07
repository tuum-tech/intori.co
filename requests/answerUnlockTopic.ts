import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AnswerUnlockTopicType } from '@/models/answerUnlockTopic'

export const useAnswerUnlockTopic = (params: { question: string }) => {
  const { question } = params
  return useQuery<AnswerUnlockTopicType[] | null>({
    queryKey: ['answer-unlock-topic', question],
    queryFn: async () => {
      if (!question) return null
      const { data } = await axios.get<AnswerUnlockTopicType[]>(
        `/api/answer-unlock-topic?question=${encodeURIComponent(question)}`
      )
      return data
    },
    enabled: !!question,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  })
} 
