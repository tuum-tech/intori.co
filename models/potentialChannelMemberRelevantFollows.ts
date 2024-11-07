import { createDb } from '../pages/api/utils/firestore'

export type PotentialChannelMemberRelevantFollow = {
  channelId: string
  potentialMemberFid: number
  followedByFid: number
  followedByRole: 'moderator' | 'member'
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  return db.collection('potentialChannelMembersRelevantFollows')
}

export const isRelevantFollowSaved = async (params: {
  channelId: string
  potentialMemberFid: number
  followedByFid: number
}): Promise<boolean> => {
  const collection = getCollection()
  const query = collection
    .where('potentialMemberFid', '==', params.potentialMemberFid)
    .where('followedByFid', '==', params.followedByFid)
    .where('channelId', '==', params.channelId)

  const snapshot = await query.get()

  return snapshot.size > 0
}

export const createRelevantFollow = async (
  body: PotentialChannelMemberRelevantFollow
) => {
  const collection = getCollection()
  await collection.add(body)

  return body
}

// find members of this channel that follow this potential member
export const getRelevantFollows = async (params: {
  channelId: string
  potentialMemberFid: number
}): Promise<PotentialChannelMemberRelevantFollow[]> => {
  const collection = getCollection()
  const query = collection
    .where('potentialMemberFid', '==', params.potentialMemberFid)
    .where('channelId', '==', params.channelId)

  const snapshot = await query.get()

  return snapshot.docs.map(doc => {
    return doc.data() as PotentialChannelMemberRelevantFollow
  })
}
