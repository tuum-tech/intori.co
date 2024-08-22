import { v4 as uuid } from 'uuid'
import { createDb } from '../pages/api/utils/firestore'
import { syncCategories } from './categories'

export type QuestionType = {
  id: string
  question: string
  answers: string[]
  categories: string[]
  order: number
}

export type CreateQuestionType = {
  question: string
  answers: string[]
  categories: string[]
  order: number
}

let frameSessionsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (frameSessionsCollection) {
    return frameSessionsCollection
  }

  const db = createDb()
  return db.collection('questions')
}

export const createQuestion = async (newQuestion: CreateQuestionType) => {
  const collection = getCollection()

  const doc = await collection.add({
    id: uuid(),
    ...newQuestion
  })

  const ref = await doc.get()

  await syncCategories(newQuestion.categories)

  return ref.data() as QuestionType
}

export const getAllQuestions = async (params: {
  category?: string
} = {}): Promise<QuestionType[]> => {
  const collection = getCollection()

  let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>

  if (params.category) {
    query = query.where('categories', 'array-contains', params.category)
  }

  const ref = await query.get()

  const allQuestions = ref.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as QuestionType[]

  return allQuestions.sort((a, b) => a.order - b.order)
}

export const getQuestionById = async (id: string) => {
  const collection = getCollection()

  const query = await collection.where('id', '==', id).limit(1).get()

  if (!query.size) {
    return null
  }

  return query.docs[0].data() as QuestionType
}

export const updateQuestionById = async (
  id: string,
  body: QuestionType
) => {
  const collection = getCollection()

  await syncCategories(body.categories)
  return collection.doc(id).set(body, { merge: true })
}

// TODO: mark as deleted
export const deleteQuestionById = async (id: string) => {
  const collection = getCollection()

  await collection.doc(id).delete()
}

export const questionAlreadyExists = async (params: {
  question: string
  excludeQuestionId?: string
}): Promise<boolean> => {
  const { question, excludeQuestionId } = params

  const collection = getCollection()

  let query = collection.where('question', '==', question)

  if (excludeQuestionId) {
    query = query.where('id', '!=', excludeQuestionId)
  }

  const ref = await query.limit(1).get()

  return !!ref.size
}
