import { createDb } from '../pages/api/utils/firestore'

export type UserCaptchaResponse = {
  fid: number
  isLikelyBot: boolean
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  return db.collection('userCaptchaResponses')
}

export const createUserCaptchaResponse = async (
  body: {
    fid: number,
    isLikelyBot: boolean
  }
): Promise<UserCaptchaResponse> => {
  const collection = getCollection()

  // if fid already exists, update the document
  const { fid, isLikelyBot } = body

  const query = collection.where('fid', '==', fid)
  const snapshot = await query.get()

  if (!snapshot.empty) {
    const doc = snapshot.docs[0]
    await doc.ref.update({ isLikelyBot })
    return {
      fid,
      isLikelyBot,
    }
  }

  await collection.add(body)

  return {
    fid,
    isLikelyBot,
  }
}

export const getUserCaptchaResponse = async (
  fid: number
): Promise<UserCaptchaResponse | null> => {
  const collection = getCollection()

  const query = collection.where('fid', '==', fid)
  const snapshot = await query.get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  return {
    fid: doc.data().fid,
    isLikelyBot: doc.data().isLikelyBot,
  }
}
