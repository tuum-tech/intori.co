import axios from 'axios'
import { CreateQuestionType, QuestionType } from '../models/questions'

export const updateQuestion = async (questionId: string, body: QuestionType) => {
  return axios.put(`/api/questions/${questionId}`, body)
}

export const deleteQuestion = async (questionId: string) => {
  return axios.delete(`/api/questions/${questionId}`)
}

export const createQuestion = async (body: CreateQuestionType) => {
  return axios.post(`/api/questions/new`, body)
}
