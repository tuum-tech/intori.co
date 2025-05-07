import { createDb } from '../pages/api/utils/firestore'

export type UserUnlockedTopicType = {
  fid: number
  topic: string
  createdAt: number
}

let categoryCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (categoryCollection) {
    return categoryCollection
  }

  const db = createDb()
  return db.collection('userUnlockedTopics')
}

export const createUserUnlockedTopic = async (params: {
  fid: number
  topic: string
}): Promise<void> => {
  const collection = getCollection()

  const data: UserUnlockedTopicType = {
    fid: params.fid,
    topic: params.topic,
    createdAt: Date.now(),
  }

  await collection.add(data)
}
