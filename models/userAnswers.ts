import { prisma } from "@/prisma"
import { chunkArray } from '@/utils/chunkArray'

export const getUserAnswersByQuestionAndAnswer = async (options: {
  answer: string
  question: string
}): Promise<{ fid: number }[]> => {
  const { answer, question } = options
  const userAnswers = await prisma.userAnswer.findMany({
    where: {
      answer,
      question,
    },
    select: {
      fid: true,
    },
  })

  return userAnswers
}


export const getUniqueUsersOverTime = async (options: {
  startDate: Date
  endDate: Date
}): Promise<Array<{ date: string, uniqueUsers: number }>> => {
  const { startDate, endDate } = options
  // Split the date range into 30-day chunks
  const days: Date[] = []
  let d = new Date(startDate)
  while (d <= endDate) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  const dayChunks = chunkArray(days, 30)

  let answers: { id: string, createdAt: Date, fid: number }[] = []
  const PAGE_SIZE = 250;
  for (const chunk of dayChunks) {
    const chunkStart = chunk[0]
    const chunkEnd = chunk[chunk.length - 1]
    let hasMore = true;
    let cursor: string | undefined = undefined;
    while (hasMore) {
      const chunkAnswers: { id: string, createdAt: Date, fid: number }[] = await prisma.userAnswer.findMany({
        where: {
          createdAt: {
            gte: chunkStart,
            lte: chunkEnd,
          },
        },
        select: {
          id: true,
          createdAt: true,
          fid: true,
        },
        take: PAGE_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { id: 'asc' },
      });
      answers = answers.concat(chunkAnswers);
      if (chunkAnswers.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        cursor = chunkAnswers[chunkAnswers.length - 1].id;
      }
    }
  }

  // Group by day and count unique fids
  const dateUserMap = new Map<string, Set<number>>()
  for (const answer of answers) {
    const date = answer.createdAt.toISOString().split('T')[0]
    if (!dateUserMap.has(date)) {
      dateUserMap.set(date, new Set())
    }
    dateUserMap.get(date)!.add(answer.fid)
  }

  // Prepare and sort the result
  const chartData = Array.from(dateUserMap.entries())
    .map(([date, userSet]) => ({ date, uniqueUsers: userSet.size }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return chartData
}

export const getQuestionsAnsweredOverTime = async (options: {
  startDate: Date
  endDate: Date
}): Promise<Array<{ date: string, questionsAnswered: number }>> => {
  const { startDate, endDate } = options
  // Split the date range into 30-day chunks
  const days: Date[] = []
  let d = new Date(startDate)
  while (d <= endDate) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  const dayChunks = chunkArray(days, 30)

  let answers: { id: string, createdAt: Date }[] = []
  const PAGE_SIZE = 250;
  for (const chunk of dayChunks) {
    const chunkStart = chunk[0]
    const chunkEnd = chunk[chunk.length - 1]
    let hasMore = true;
    let cursor: string | undefined = undefined;
    while (hasMore) {
      const chunkAnswers: { id: string, createdAt: Date }[] = await prisma.userAnswer.findMany({
        where: {
          createdAt: {
            gte: chunkStart,
            lte: chunkEnd,
          },
        },
        select: {
          id: true,
          createdAt: true,
        },
        take: PAGE_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { id: 'asc' },
      });
      answers = answers.concat(chunkAnswers);
      if (chunkAnswers.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        cursor = chunkAnswers[chunkAnswers.length - 1].id;
      }
    }
  }

  // Group by day and count answers
  const dateQuestionMap = new Map<string, number>()
  for (const answer of answers) {
    const date = answer.createdAt.toISOString().split('T')[0]
    dateQuestionMap.set(date, (dateQuestionMap.get(date) || 0) + 1)
  }

  // Prepare and sort the result
  const chartData = Array.from(dateQuestionMap.entries())
    .map(([date, questionsAnswered]) => ({ date, questionsAnswered }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return chartData
}

export const countTotalUserAnswers = async (): Promise<number> => {
  const total = await prisma.userAnswer.count()
  return total
}
