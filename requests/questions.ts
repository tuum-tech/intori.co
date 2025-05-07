import axios, { AxiosResponse } from 'axios'
import { CreateQuestionType, QuestionType } from '../models/questions'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export const updateQuestion = async (questionId: string, body: QuestionType) => {
  return axios.put(`/api/questions/${questionId}`, body)
}

export const deleteQuestion = async (questionId: string) => {
  return axios.delete(`/api/questions/${questionId}`)
}

export const createQuestion = async (
  body: CreateQuestionType
): Promise<AxiosResponse<QuestionType>> => {
  return axios.post(`/api/questions/new`, body)
}

export const usePaginatedQuestions = (limit: number = 20, search: string = '') => {
  return useInfiniteQuery({
    queryKey: ['paginated-questions', limit, search],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(search && { search }),
        ...(pageParam && { lastDocId: pageParam })
      })
      const { data } = await axios.get(`/api/questions?${params.toString()}`)
      return data
    },
    getNextPageParam: (lastPage) => lastPage.nextPageCursor,
    initialPageParam: undefined as string | undefined,
  })
}

export const useQuestionsCount = () => {
  return useQuery({
    queryKey: ['questions-count'],
    queryFn: async () => {
      const { data } = await axios.get<{ count: number }>(`/api/questions/count`)
      return data.count
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
