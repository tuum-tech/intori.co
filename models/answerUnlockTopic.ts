import { type AnswerUnlockTopic, type Prisma } from "@prisma/client"
import { prisma } from "@/prisma"

export const createAnswerUnlockTopic = async (body: {
  question: string
  answer: string
  unlockTopics: string[]
}) => {
  const alreadyExists = await prisma.answerUnlockTopic.findFirst({
    where: {
      question: body.question,
      answer: body.answer
    },
    select: { id: true }
  })

  if (alreadyExists) {
    throw new Error('Answer unlock topic already exists')
  }

  return prisma.answerUnlockTopic.create({
    data: {
      question: body.question,
      answer: body.answer,
      unlockTopics: body.unlockTopics
    }
  })
}

export const getAnswerUnlockTopic = async (
  body: {
    question: string
    answer?: string
  }
):Promise<AnswerUnlockTopic[]> => {
  const where: Prisma.AnswerUnlockTopicWhereInput = {
    question: body.question
  }

  if (body.answer) {
    where.answer = body.answer
  }

  return prisma.answerUnlockTopic.findMany({ where })
}
