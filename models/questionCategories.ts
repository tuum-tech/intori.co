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
  return db.collection('frameSessions')
}

export const addQuestionCategory = async (body: QuestionCategoryType) => {
  const collection = getCollection()

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
