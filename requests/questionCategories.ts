import axios, { AxiosResponse } from 'axios'
import { QuestionCategoryType } from '../models/questionCategories'

export const getQuestionCategories = async(
  questionId: string
): Promise<AxiosResponse<QuestionCategoryType[]>> => {
  return axios.get(`/api/questions/${questionId}/categories`)
}

export const getAllQuestionsOfCategory = async(
  categoryId: string
): Promise<AxiosResponse<QuestionCategoryType[]>> => {
  return axios.get(`/api/questions/all/categories?categoryId=${categoryId}`)
}

export const addQuestionCategory = async (params: {
  questionId: string
  categoryId: string
}): Promise<AxiosResponse<QuestionCategoryType>> => {
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
