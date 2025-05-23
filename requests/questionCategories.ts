import axios, { type AxiosResponse } from 'axios'
import { type QuestionCategory } from '@prisma/client'

export const getQuestionCategories = async(
  questionId: string
): Promise<AxiosResponse<QuestionCategory[]>> => {
  return axios.get(`/api/questions/${questionId}/categories`)
}

export const getAllQuestionsOfCategory = async(
  categoryId: string
): Promise<AxiosResponse<QuestionCategory[]>> => {
  return axios.get(`/api/questions/all/categories?categoryId=${categoryId}`)
}

export const getAllQuestionCategories = async (): Promise<AxiosResponse<QuestionCategory[]>> => {
  return axios.get('/api/questions/all/categories')
}

export const addQuestionCategory = async (params: {
  questionId: string
  categoryId: string
}): Promise<AxiosResponse<QuestionCategory>> => {
  const { questionId, categoryId } = params

  return axios.post(
    `/api/questions/${questionId}/categories?categoryId=${categoryId}`
  )
}

export const deleteQuestionCategory = async (params: {
  questionId: string
  categoryId: string
}): Promise<AxiosResponse<void>> => {
  const { questionId, categoryId } = params

  return axios.delete(
    `/api/questions/${questionId}/categories?categoryId=${categoryId}`
  )
}
