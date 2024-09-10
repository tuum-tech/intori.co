import { createDb } from '../pages/api/utils/firestore'

export type SuggestionDislike = {
  fid: number
  dislikesFid: number
}

let suggestionDislikesCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (suggestionDislikesCollection) {
    return suggestionDislikesCollection
  }

  const db = createDb()
  return db.collection('suggestionDislikes')
}

export const createSuggestionDislike = async (params: {
  fid: number
  dislikesFid: number
}) => {
  const { fid, dislikesFid } = params
  const collection = getCollection()

  const id = `${fid}-${dislikesFid}`
  // check if rating exists for fid, create if not found
  const ratingDoc = collection.doc(id)

  await ratingDoc.set({ fid, dislikesFid })
}

export const getSuggestionDislikes = async (
  fid: number
): Promise<SuggestionDislike[]> => {
  const collection = getCollection()

  const ratingDoc = collection.where('fid', '==', fid)
  const ratingDocSnapshot = await ratingDoc.get()

  return ratingDocSnapshot.docs.map(doc => doc.data() as SuggestionDislike)
}
