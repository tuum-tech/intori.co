import { type QuestionCategory } from "@prisma/client"
import { prisma } from "@/prisma"

export const getQuestionCategories = async (
  questionId: string
): Promise<QuestionCategory[]> => {
  return prisma.questionCategory.findMany({
    where: { questionId }
  })
}

export const addQuestionCategory = async (body: {
  questionId: string
  categoryId: string
}): Promise<QuestionCategory> => {
  const alreadyExists = await prisma.questionCategory.findFirst({
    where: {
      questionId: body.questionId,
      categoryId: body.categoryId
    },
    select: { id: true }
  })

  if (alreadyExists) {
    throw new Error('Question category already exists')
  }

  return await prisma.questionCategory.create({
    data: {
      questionId: body.questionId,
      categoryId: body.categoryId
    }
  })
}

export const deleteQuestionCategory = async (body: {
  questionId: string
  categoryId: string
}): Promise<void> => {
  await prisma.questionCategory.deleteMany({
    where: {
      questionId: body.questionId,
      categoryId: body.categoryId
    }
  })
}

export const deleteQuestionCategoriesByCategoryId = async (
  categoryId: string
): Promise<void> => {
  await prisma.questionCategory.deleteMany({
    where: {
      categoryId
    }
  })
}

export const getQuestionsOfCategory = async (categoryId: string): Promise<QuestionCategory[]> => {
  return prisma.questionCategory.findMany({
    where: { categoryId }
  })
}

export const getAllQuestionCategories = async (): Promise<QuestionCategory[]> => {
  return prisma.questionCategory.findMany({})
}
