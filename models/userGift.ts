import { createDb } from '../pages/api/utils/firestore'

export type UserGiftType = {
  id: string
  sentFromFid: number
  sentToFid: number
  opened: boolean
  createdAt: number

  // this gift is a sent back gift
  sentBackGiftFor?: string

  // a gift was sent back for this git
  sentGiftBack?: boolean

  unlocked?: boolean
  isSuperGift?: boolean
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  collection = db.collection('userGifts')
  return collection
}

export const countGiftsSent = async (fid: number): Promise<number> => {
  const col = getCollection()

  const query = await col
    .where('sentFromFid', '==', fid)
    .get()

  return query.size
}
