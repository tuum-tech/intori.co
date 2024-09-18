import axios, { AxiosResponse } from 'axios'
import { CategoryType } from '../models/categories'

export const createCategory = (body: {
  category: string
}): Promise<AxiosResponse<CategoryType>> => {
  return axios.post('/api/categories/new', body)
}

export const deleteCategory = (categoryId: string): Promise<AxiosResponse<void>> => {
  return axios.delete(`/api/categories/${categoryId}`)
}
