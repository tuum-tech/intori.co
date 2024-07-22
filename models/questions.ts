import { createDb } from '../pages/api/utils/firestore'

export type QuestionType = {
  id: string
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

  return { id: ref.id, ...ref.data() } as QuestionType

}

export const getAllQuestions = async (): Promise<QuestionType[]> => {
  const collection = getCollection()

  const ref = await collection.get()

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

export const updateQuestionById = (
  id: string,
  body: QuestionType
) => {
  const collection = getCollection()

  return collection.doc(id).set(body, { merge: true })
}

export const deleteQuestionById = async (id: string) => {
  const collection = getCollection()

  await collection.doc(id).delete()
}
