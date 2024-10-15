import { createDb } from '../pages/api/utils/firestore'

export type PotentialChannelMemberType = {
  fid: number
  channelId: string
  castHash: string
}

type CreatePotentialChannelMemberType = {
  fid: number
  channelId: string
  castHash: string
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  return db.collection('potentialChannelMembers')
}

export const getPotentialChannelMembers = async (params: {
  channelId?: string
}): Promise<PotentialChannelMemberType[]> => {
  const collection = getCollection()
  let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>

  if (params.channelId) {
    query = collection.where('channelId', '==', params.channelId)
  }

  const snapshot = await query.get()

  return snapshot.docs.map(doc => {
    const data = doc.data()
    return data
  }) as PotentialChannelMemberType[]
}

export const createPotentialChannelMember = async (
  body: CreatePotentialChannelMemberType
): Promise<PotentialChannelMemberType> => {
  const collection = getCollection()

  // check if already exists by unique cast hash
  const snapshot = await collection.where('castHash', '==', body.castHash).get()

  if (snapshot.docs.length) {
    return body
  }

  await collection.add(body)

  return body
}

export const deletePotentialChannelMember = async (params: {
  fid: number
  channelId: string
}): Promise<void> => {
  const collection = getCollection()
  const snapshot = await collection.where('fid', '==', params.fid).where('channelId', '==', params.channelId).get()

  if (snapshot.empty) {
    return
  }

  const doc = snapshot.docs[0]
  await collection.doc(doc.id).delete()
}
