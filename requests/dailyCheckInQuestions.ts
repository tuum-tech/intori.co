import axios from 'axios'
import { type DailyCheckInQuestion } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'

type PaginatedDailyCheckInQuestionsResponse = {
  questions: DailyCheckInQuestion[]
  total: number
}

export const usePaginatedDailyCheckInQuestions = (
  limit: number = 20,
  search: string = ''
) => {
  return useInfiniteQuery({
    queryKey: ['paginated-daily-checkin-questions', limit, search],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: pageParam.toString(),
        ...(search && { search }),
      })
      const { data } = await axios.get<PaginatedDailyCheckInQuestionsResponse>(`/api/questions/daily-checkin?${params.toString()}`)
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
