import { createDb } from '../pages/api/utils/firestore'

export type AnswerUnlockTopicType = {
  question: string
  answer: string
  unlockTopics: string[]
}

let frameSessionsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (frameSessionsCollection) {
    return frameSessionsCollection
  }

  const db = createDb()
  return db.collection('answerUnlockTopic')
}

export const createAnswerUnlockTopic = async (body: AnswerUnlockTopicType) => {
  const collection = getCollection()

  // check if already exists
  const query = collection
    .where('question', '==', body.question)
    .where('answer', '==', body.answer)

  const snapshot = await query.get()
  if (!snapshot.empty) {
    throw new Error('Answer unlock topic already exists')
  }

  const doc = await collection.add(body)

  const ref = await doc.get()

  return ref.data()
}

export const getAnswerUnlockTopic = async (
  body: {
    question: string
    answer?: string
  }
):Promise<AnswerUnlockTopicType[]> => {
  const collection = getCollection()

  const query = collection
    .where('question', '==', body.question)

  if (body.answer) {
    query.where('answer', '==', body.answer)
  }

  const snapshot = await query.get()

  if (snapshot.empty) {
    return []
  }

  const answerUnlockTopics = snapshot.docs.map((doc) => doc.data()) as AnswerUnlockTopicType[]
  return answerUnlockTopics
}
