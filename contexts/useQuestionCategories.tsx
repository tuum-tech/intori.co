import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';
import { toast } from 'react-toastify'
import { QuestionCategory } from "@prisma/client"
import {
  addQuestionCategory,
  deleteQuestionCategory,
  getAllQuestionCategories
} from '@/requests/questionCategories'

interface QuestionCategoriesContextType {
  questionCategories: QuestionCategory[]

  createQuestionCategory: (body: {
    categoryId: string
    questionId: string
  }) => Promise<void>

  removeQuestionCategory: (body: {
    categoryId: string
    questionId: string
  }) => Promise<void>
}

const QuestionCategoriesContext = createContext<QuestionCategoriesContextType>({
  questionCategories: [],
  createQuestionCategory: async () => {},
  removeQuestionCategory: async () => {}
})

type Props = {
  children: ReactNode
}

// Create a provider component
export const QuestionCategoriesProvider = ({
  children
}: Props) => {
  const [
    questionCategories,
    setQuestionCategories
  ] = useState<QuestionCategory[]>([])

  const fetchQuestionCategories = useCallback(async () => {
    try {
      const res = await getAllQuestionCategories()
      setQuestionCategories(res.data)
    } catch (err) {
      toast.error('Failed to load categories for question. Please try again later.')
      setQuestionCategories([])
    }
  }, [])

  useEffect(() => {
    fetchQuestionCategories()
  }, [fetchQuestionCategories])

  const createQuestionCategory = async (body: {
    questionId: string
    categoryId: string
  }) => {
    try {
      const res = await addQuestionCategory(body)
      setQuestionCategories([...questionCategories, res.data])
      toast.success('New question category added.')
    } catch (err) {
      toast.error('Failed to add new question category. Please try again later.')
    }
  }

  const removeQuestionCategory = async (body: {
    questionId: string
    categoryId: string
  }) => {
    try {
      await deleteQuestionCategory(body)

      setQuestionCategories(
        questionCategories.filter((qc) => {
          if (
            qc.questionId === body.questionId &&
            qc.categoryId === body.categoryId
          ) {
            return false
          }

          return true
        })
      )
      toast.success('Question category removed.')
    } catch (err) {
      toast.error('Failed to remove question category. Please try again later.')
    }
  }

  return (
    <QuestionCategoriesContext.Provider value={{ questionCategories, createQuestionCategory, removeQuestionCategory }}>
      {children}
    </QuestionCategoriesContext.Provider>
  )
}

// Create a custom hook to consume the context
export const useQuestionCategories = () => {
  const context = useContext(QuestionCategoriesContext)

  if (!context) {
    throw new Error('useQuestionCategories must be used')
  }

  return context
}
