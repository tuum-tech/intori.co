import { prisma } from "@/prisma"

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
  // Fetch all user answers in the date range
  const answers = await prisma.userAnswer.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
      fid: true,
    },
  })

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
  // Fetch all user answers in the date range
  const answers = await prisma.userAnswer.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
  })

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
