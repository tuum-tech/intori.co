import axios, { AxiosResponse } from 'axios'
import { CreateQuestionType, QuestionType } from '../models/questions'

export const updateQuestion = async (questionId: string, body: QuestionType) => {
  return axios.put(`/api/questions/${questionId}`, body)
}

export const deleteQuestion = async (questionId: string) => {
  return axios.delete(`/api/questions/${questionId}`)
}

export const createQuestion = async (
  body: CreateQuestionType
): Promise<AxiosResponse<QuestionType>> => {
  return axios.post(`/api/questions/new`, body)
}

export const getQuestionCategories = async (): Promise<AxiosResponse<string[]>> => {
  return axios.get(`/api/questions/categories`)
}

export const getQuestionsByCategory = async (category: string): Promise<AxiosResponse<QuestionType[]>> => {
  return axios.get(`/api/questions?category=${category}`)
}
