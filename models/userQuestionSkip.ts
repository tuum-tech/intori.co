import { createDb } from '../pages/api/utils/firestore'
import { Timestamp } from 'firebase/firestore'

export type UserQuestionSkip = {
  fid: number
  question: string
  date?: Timestamp
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

  await collection.add({
    ...newSkip,
    date: new Date()
  })

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

export const getLastSkippedQuestions = async (fid: number, amount: number): Promise<string[]> => {
  const collection = getCollection()

  const query = await collection
    .where('fid', '==', fid)
    .orderBy('date', 'desc')
    .select('question')
    .limit(amount)
    .get()

  if (query.docs.length === 0) {
    return []
  }

  return query.docs.map((doc) => {
    const data = doc.data()

    return data.question
  })
}

export const countAllUserQuestionSkips = async (): Promise<number> => {
  const collection = getCollection()
  const query = await collection.get()

  return query.docs.length
}
