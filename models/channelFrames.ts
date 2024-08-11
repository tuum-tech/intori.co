import { createDb } from '../pages/api/utils/firestore'

export type ChannelFrameType = {
  channelId: string
  category: string
  introQuestions: string[] // question ids
  postSchedule: 'biweekly' | 'weekly' | 'bimonthly' | 'monthly'
  adminFid: number
}

export type CreateChannelFrameType = {
  channelId: string
  category: string
  introQuestions: string[] // question ids
  postSchedule: 'biweekly' | 'weekly' | 'bimonthly' | 'monthly'
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
}) => {
  const collection = getCollection()

  let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>

  if (params.adminFid) {
    query = query.where('adminFid', '==', params.adminFid)
  }

  const snapshot = await query.get()

  return snapshot.docs.map((doc) => doc.data() as ChannelFrameType)
}
