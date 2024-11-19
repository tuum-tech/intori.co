import { createDb } from '../pages/api/utils/firestore'
import {
  getMembersOfChannel
} from '../utils/neynarApi'

export type SavedChannelMemberType = {
  channelId: string
  fid: number
  role: 'moderator' | 'member'
}

let channelMembersCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (channelMembersCollection) {
    return channelMembersCollection
  }

  const db = createDb()
  return db.collection('channelMembers')
}


export const getSavedMembersOfChannel = async (params: {
  channelId: string
  role?: 'moderator' | 'member'
}): Promise<SavedChannelMemberType[]> => {
  const collection = getCollection()

  let query = collection.where('channelId', '==', params.channelId)

  if (params.role) {
    query = query.where('role', '==', params.role)
  }

  const querySnapshot = await query.get()

  return querySnapshot.docs.map((doc) => doc.data() as SavedChannelMemberType)
}

export const countSavedMembersOfChannel = async (params: {
  channelId: string
}): Promise<number> => {
  const collection = getCollection()

  const querySnapshot = await collection.where('channelId', '==', params.channelId).get()

  return querySnapshot.size
}

export const saveChannelMembersForChannel = async (channelId: string): Promise<void> => {
  const currentCount = await countSavedMembersOfChannel({ channelId })

  if (currentCount > 0) {
    throw new Error("Channel members already saved")
  }

  const channelMembers = await getMembersOfChannel({ channelId })

  const collection = getCollection()

  const batch = createDb().batch()

  channelMembers.forEach((channelMember) => {
    const ref = collection.doc()
    batch.set(ref, {
      channelId,
      fid: channelMember.user.fid,
      role: channelMember.role
    })
  })

  await batch.commit()
}
