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

export const createQuestion = async (newQuestion: QuestionType) => {
  const collection = getCollection()

  const doc = await collection.add({
    ...newQuestion
  })

  const ref = await doc.get()

  await syncCategories(newQuestion.categories)
  return { id: ref.id, ...ref.data() } as QuestionType

}

export const getAllQuestions = async (params: {
  category?: string
}): Promise<QuestionType[]> => {
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

  const doc = await collection.doc(id).get()

  if (!doc.exists) {
    return null
  }

  return { id: doc.id, ...doc.data() } as QuestionType
}

export const updateQuestionById = async (
  id: string,
  body: QuestionType
) => {
  const collection = getCollection()

  await syncCategories(body.categories)
  return collection.doc(id).set(body, { merge: true })
}

export const deleteQuestionById = async (id: string) => {
  const collection = getCollection()

  await collection.doc(id).delete()
}
