import { createDb } from '../pages/api/utils/firestore'

export type FriendRequestType = {
  fromFid: number
  toFid: number
  status: "pending" | "accepted" | "rejected"
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  collection = db.collection('friendRequest')
  return collection
}

export const countTotalFriends = async (fid: number): Promise<number> => {
  const col = getCollection()
  const query = await col
    .where("fromFid", "==", fid)
    .where("status", "==", "accepted")
    .get()

  const sentToMe = await col
    .where("toFid", "==", fid)
    .where("status", "==", "accepted")
    .get()

  return query.size + sentToMe.size
}
