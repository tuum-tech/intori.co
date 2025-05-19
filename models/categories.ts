import { type Category } from "@prisma/client"
import { prisma } from "@/prisma"

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany()
}

export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  return prisma.category.findUnique({
    where: { id: categoryId }
  })
}

export const getCategoryByName = async (
  category: string
): Promise<Category | null> => {
  return prisma.category.findFirst({
    where: { category }
  })
}

export const doesCategoryExist = async (category: string): Promise<boolean> => {
  const exists = await prisma.category.findFirst({
    where: { category },
    select: { id: true }
  })

  return !!exists
}

export const createCategory = async (category: string): Promise<Category> => {
  return prisma.category.create({
    data: {
      category
    }
  })
}

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await prisma.category.delete({
    where: { id: categoryId }
  })
}
