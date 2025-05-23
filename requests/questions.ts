import axios, { type AxiosResponse } from 'axios'
import { type Question } from '@prisma/client'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

type CreateQuestionType = Omit<Question, 'id'>

export const updateQuestion = async (questionId: string, body: Question) => {
  return axios.put(`/api/questions/${questionId}`, body)
}

export const deleteQuestion = async (questionId: string) => {
  return axios.delete(`/api/questions/${questionId}`)
}

export const createQuestion = async (
  body: CreateQuestionType
): Promise<AxiosResponse<Question>> => {
  return axios.post(`/api/questions/new`, body)
}

export const usePaginatedQuestions = (
  limit: number = 20,
  search: string = '',
  byTopic: string = ''
) => {
  return useInfiniteQuery({
    queryKey: ['paginated-questions', limit, search, byTopic],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: pageParam.toString(),
        ...(search && { search }),
        ...(byTopic && { byTopic }),
      })
      const { data } = await axios.get(`/api/questions?${params.toString()}`)
      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.questions || lastPage.questions.length < limit) return undefined;
      // Calculate the next skip value
      return allPages.reduce((acc, page) => acc + (page.questions?.length || 0), 0);
    },
    initialPageParam: 0 as number,
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
