import { createDb } from '../pages/api/utils/firestore'
import { getFidsUserIsFollowing } from '../utils/neynarApi'

export type UserFollowingType = {
  fid: number
  followingFid: number
}

let userAnswersCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (userAnswersCollection) {
    return userAnswersCollection
  }

  const db = createDb()
  return db.collection('userFollowings')
}

const resetUserFollowings = async (fid: number) => {
  const collection = getCollection()

  const querySnapshot = await collection.where('fid', '==', fid).get()

  const batch = createDb().batch()

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()
}

export const saveUserFollowings = async (fid: number) => {
  try {
    const collection = getCollection()

    await resetUserFollowings(fid)
    const fids = await getFidsUserIsFollowing(fid)

    const batch = createDb().batch()

    const userFollowings: UserFollowingType[] = fids.map((followingFid) => ({
      fid,
      followingFid
    }))

    userFollowings.forEach((userFollowing) => {
      const ref = collection.doc()
      batch.set(ref, userFollowing)
    })

    await batch.commit()
  } catch (err) {
    console.error(`Failed to save user followings for ${fid}`, err)
  }
}

export const doesUserAlreadyFollowUser = async (fid: number, followingFid: number) => {
  const collection = getCollection()

  const querySnapshot = await collection
    .where('fid', '==', fid)
    .where('followingFid', '==', followingFid)
    .get()

  return !querySnapshot.empty
}
