import { createDb } from '../pages/api/utils/firestore'

export type FollowClickType = {
  fid: number
  toFollowFid: number
}

let followClickCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (followClickCollection) {
    return followClickCollection
  }

  const db = createDb()
  return db.collection('followClicks')
}

export const createFollowClick = async (newFollowClick: FollowClickType) => {
  const collection = getCollection()

  const doc = await collection.add(newFollowClick)
  const ref = await doc.get()

  return ref.data() as FollowClickType
}
