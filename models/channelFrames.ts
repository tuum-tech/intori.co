import { createDb } from '../pages/api/utils/firestore'
import { getChannelDetails } from '../utils/neynarApi'

export type ChannelFrameType = {
  channelId: string
  category: string
  introQuestions: string[] // question ids
  adminFid: number
}

export type CreateChannelFrameType = {
  channelId: string
  category: string
  introQuestions: string[] // question ids
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

  // get channel leader fid
  const channelDetails = await getChannelDetails(newChannelFrame.channelId)

  if (!channelDetails) {
    return null
  }

  const doc = await collection.add({
    ...newChannelFrame,
    adminFid: channelDetails.adminFid
  })

  const ref = await doc.get()

  return ref.data() as ChannelFrameType

}
