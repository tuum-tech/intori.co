import { createDb } from '../pages/api/utils/firestore'

export type SuggestionRatingType = {
  fid: number
  rating: number
}

let suggestionRatingCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (suggestionRatingCollection) {
    return suggestionRatingCollection
  }

  const db = createDb()
  return db.collection('suggestionRatings')
}

export const updateSuggestionRating = async (params: {
  fid: number
  rating: number
}) => {
  const { fid, rating } = params
  const collection = getCollection()

  // check if rating exists for fid, create if not found
  const ratingDoc = collection.doc(fid.toString())
  const ratingDocSnapshot = await ratingDoc.get()

  if (!ratingDocSnapshot.exists) {
    await ratingDoc.set({ fid, rating })
    return
  }

  // update rating by adding new rating to existing rating
  const existingRating = (ratingDocSnapshot.data() as SuggestionRatingType).rating
  const newRating = existingRating + rating

  await ratingDoc.update({
    rating: newRating
  })
}

export const getSuggestionRating = async (
  fid: number
): Promise<SuggestionRatingType> => {
  const collection = getCollection()

  const ratingDoc = collection.doc(fid.toString())
  const ratingDocSnapshot = await ratingDoc.get()

  if (!ratingDocSnapshot.exists) {
    return {
      fid,
      rating: 0
    }
  }

  return ratingDocSnapshot.data() as SuggestionRatingType
}
