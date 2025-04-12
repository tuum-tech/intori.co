import { createDb } from '../pages/api/utils/firestore'

export type UserPointTotalType = {
  fid: number
  points: string
  lastUpdated: number
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  collection = db.collection('userPointTotals')
  return collection
}

export const getPointsTotalForFid = async (fid: number): Promise<string> => {
  const col = getCollection()
  const querySnapshot = await col.where('fid', '==', fid).get()

  if (querySnapshot.empty) {
    return "0"
  }

  const data = querySnapshot.docs[0].data() as UserPointTotalType
  return data.points
}
