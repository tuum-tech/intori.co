import axios, { AxiosResponse } from 'axios'
import { type Category } from '@prisma/client'

export const createCategory = (body: {
  category: string
}): Promise<AxiosResponse<Category>> => {
  return axios.post('/api/categories/new', body)
}

export const deleteCategory = (categoryId: string): Promise<AxiosResponse<void>> => {
  return axios.delete(`/api/categories/${categoryId}`)
}

export const getAllCategories = (): Promise<AxiosResponse<Category[]>> => {
  return axios.get('/api/categories')
}
