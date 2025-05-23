import { type Prisma, type Question } from "@prisma/client"
import { prisma } from "@/prisma"

export const getQuestionByQuestionText = async (question: string) => {
  return prisma.question.findFirst({
    where: { question }
  })
}

export const getQuestionById = async (id: string) => {
  return prisma.question.findUnique({
    where: { id }
  })
}

export const deleteQuestionById = async (id: string) => {
  return prisma.question.delete({
    where: { id }
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

  if (alreadyExists) {
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
  byTopic?: string
}): Promise<{ questions: Question[]; total: number }> => {
  const where: Prisma.QuestionWhereInput = {
    deleted: false,
    question: {
      contains: params.search || "",
      mode: "insensitive"
    }
  }

  if (params.byTopic) {
    where.topics = {
      has: params.byTopic
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

export const addTopicsToQuestion = async (options: {
  question: string
  topics: string[]
}): Promise<void> => {
  const { question, topics } = options

  const questionRecord = await getQuestionByQuestionText(question)

  if (!questionRecord) {
    throw new Error(`Question "${question}" not found`)
  }

  await prisma.question.update({
    where: { id: questionRecord.id },
    data: {
      topics: {
        set: topics
      }
    }
  })
}
