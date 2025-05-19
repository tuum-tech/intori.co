import { type Prisma, type Question } from "@prisma/client"
import { prisma } from "@/prisma"

export const getQuestionByQuestionText = async (question: string) => {
  return prisma.question.findFirst({
    where: { question }
  })
}

export const createQuestion = async (newQuestion: {
  question: string
  answers: string[]
  topics: string[]
}) => {
  const { question, answers, topics } = newQuestion

  const alreadyExists = await prisma.question.findFirst({
    where: { question },
    select: { id: true }
  })

  if (!alreadyExists) {
    throw new Error(`"${question}" already exists`)
  }

  return prisma.question.create({
    data: {
      question,
      answers,
      topics
    }
  })
}

export const getPaginatedQuestions = async (params: {
  limit: number
  skip: number
  search?: string
}): Promise<{ questions: Question[]; total: number }> => {
  const where: Prisma.QuestionWhereInput = {
    deleted: false,
    question: {
      contains: params.search || "",
      mode: "insensitive"
    }
  }

  const questions = await prisma.question.findMany({
    where,
    take: params.limit,
    skip: params.skip
  })

  const total = await prisma.question.count({
    where
  })

  return { questions, total }
}

export const getQuestionsCount = async (): Promise<number> => {
  return prisma.question.count({
    where: { deleted: false }
  })
}
