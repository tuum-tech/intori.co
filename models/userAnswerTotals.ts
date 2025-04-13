import { createDb } from '../pages/api/utils/firestore'

export type UserAnswerTotalType = {
  id: string
  fid: number
  count: number
  lastUpdated: number
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  collection = db.collection('userAnswerTotal')
  return collection
}

export const getPageOfTopUserAnswerTotals = async (params: {
  limit: number
  lastId?: string
}): Promise<UserAnswerTotalType[]> => {
  const col = getCollection()
  let query = col.orderBy("lastUpdated", "desc").limit(params.limit)

  if (params.lastId) {
    const lastDoc = await col.doc(params.lastId).get()
    if (lastDoc) {
      query = query.startAfter(lastDoc)
    }
  }

  const querySnapshot = await query.get()

  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as UserAnswerTotalType
    data.id = doc.id
    return data
  })
}

export const countUserAnswerTotals = async (): Promise<number> => {
  const col = getCollection()
  const snapshot = await col.get()
  return snapshot.size
}
