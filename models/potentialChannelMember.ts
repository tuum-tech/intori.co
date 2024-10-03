import { createDb } from '../pages/api/utils/firestore'

export type PotentialChannelMemberType = {
  fid: number
  channelId: string
}

let collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (collection) {
    return collection
  }

  const db = createDb()
  return db.collection('potentialChannelMembers')
}

export const createPotentialChannelMember = async (body: {
  fid: number
  channelId: string
}): Promise<PotentialChannelMemberType> => {
  const collection = getCollection()
  await collection.add(body)

  return {
    fid: body.fid,
    channelId: body.channelId
  }
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
