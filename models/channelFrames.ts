import { createDb } from '../pages/api/utils/firestore'

export type ChannelFrameType = {
  channelId: string
  introQuestionIds: string[] // question ids
  adminFid: number
  addedByFid?: number
  createdAt?: number
}

export type CreateChannelFrameType = {
  channelId: string
  introQuestionIds: string[] // question ids
  addedByFid?: number
}
export type UpdateChannelFrameBodyType = {
  introQuestionIds: string[] // question ids
}

let channelFrameCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (channelFrameCollection) {
    return channelFrameCollection
  }

  const db = createDb()
  return db.collection('channelFrames')
}

export const createChannelFrame = async (newChannelFrame: ChannelFrameType) => {
  const collection = getCollection()

  newChannelFrame.createdAt = Date.now()

  const doc = await collection.add(newChannelFrame)
  const ref = await doc.get()

  return ref.data() as ChannelFrameType
}

export const getChannelFrame = async (channelId: string) => {
  const collection = getCollection()

  const query = await collection.where('channelId', '==', channelId).get()

  if (query.empty) {
    return null
  }

  return query.docs[0].data() as ChannelFrameType
}

export const getAllChannelFrames = async (params: {
  adminFid?: number
} = {}) => {
  const collection = getCollection()

  let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>

  if (params.adminFid) {
    query = query.where('adminFid', '==', params.adminFid)
  }

  const snapshot = await query.get()

  return snapshot.docs.map((doc) => doc.data() as ChannelFrameType)
}

export const updateChannelFrame = async (
  channelId: string,
  updateBody: UpdateChannelFrameBodyType
): Promise<ChannelFrameType> => {
  const collection = getCollection()

  const query = await collection.where('channelId', '==', channelId).get()

  if (query.empty) {
    throw new Error('Channel frame not found.')
  }

  const doc = query.docs[0]

  const updatedChannelFrame = {
    ...doc.data(),
    introQuestionIds: updateBody.introQuestionIds
  }

  await doc.ref.update(updatedChannelFrame)

  return updatedChannelFrame as ChannelFrameType
}
