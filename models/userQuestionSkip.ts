import { createDb } from '../pages/api/utils/firestore'

export type UserQuestionSkip = {
  fid: number
  question: string
}

let userQuestionSkipsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (userQuestionSkipsCollection) {
    return userQuestionSkipsCollection
  }

  const db = createDb()
  userQuestionSkipsCollection = db.collection('userQuestionSkips')

  return userQuestionSkipsCollection
}

export const createUserQuestionSkip = async (newSkip: UserQuestionSkip) => {
  const collection = getCollection()
  await collection.add(newSkip)

  return newSkip
}

export const didUserSkipQuestion = async (fid: number, question: string): Promise<boolean> => {
  const collection = getCollection()
  const query = await collection
    .where('fid', '==', fid)
    .where('question', '==', question)
    .get()

  return query.docs.length > 0
}
