import { createDb } from '../pages/api/utils/firestore'

export type QuestionCategoryType = {
  questionId: string
  categoryId: string
}

let frameSessionsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (frameSessionsCollection) {
    return frameSessionsCollection
  }

  const db = createDb()
  return db.collection('questionCategories')
}

export const getQuestionCategories = async (questionId: string) => {
  const collection = getCollection()

  const query = collection.where('questionId', '==', questionId)
  const snapshot = await query.get()

  const questionCategories = snapshot.docs.map((doc) => doc.data() as QuestionCategoryType)

  return questionCategories
}

export const addQuestionCategory = async (body: QuestionCategoryType) => {
  const collection = getCollection()

  // check if already exists
  const query = collection
    .where('questionId', '==', body.questionId)
    .where('categoryId', '==', body.categoryId)
  const snapshot = await query.get()
  if (!snapshot.empty) {
    throw new Error('Question category already exists')
  }

  const doc = await collection.add(body)

  const ref = await doc.get()

  return ref.data()
}

export const deleteQuestionCategory = async (body: QuestionCategoryType) => {
  const collection = getCollection()

  let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>
  query = query.where('questionId', '==', body.questionId)
  query = query.where('categoryId', '==', body.categoryId)

  const querySnapshot = await query.get()
  querySnapshot.forEach(async (doc) => {
    await doc.ref.delete()
  })
}

export const deleteAllQuestionCategories = async () => {
  const collection = getCollection()

  const snapshot = await collection.get()
  snapshot.forEach(async (doc) => {
    await doc.ref.delete()
  })
}

export const deleteQuestionCategoriesByCategoryId = async (categoryId: string): Promise<void> => {
  const collection = getCollection()

  const query = collection.where('categoryId', '==', categoryId)
  const snapshot = await query.get()
  snapshot.forEach(async (doc) => {
    await doc.ref.delete()
  })
}

export const getQuestionsOfCategory = async (categoryId: string) => {
  const collection = getCollection()

  const query = collection.where('categoryId', '==', categoryId)
  const snapshot = await query.get()

  const questionCategories = snapshot.docs.map((doc) => doc.data() as QuestionCategoryType)

  return questionCategories
}

export const getAllQuestionCategories = async (): Promise<QuestionCategoryType[]> => {
  const collection = getCollection()

  const snapshot = await collection.get()

  const questionCategories = snapshot.docs.map((doc) => doc.data() as QuestionCategoryType)

  return questionCategories
}
