import { Timestamp } from 'firebase/firestore'
import type { NextApiRequest } from 'next'
import { createDb } from '../pages/api/utils/firestore'

export type FrameSessionType = {
  id: string
  fid: number
  questionNumber: number
  createdAt: Timestamp
}

export type CreateFrameSessionType = {
  fid: number
}

let frameSessionsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (frameSessionsCollection) {
    return frameSessionsCollection
  }

  const db = createDb()
  return db.collection('frameSessions')
}

export const createFrameSession = async (newFrameSession: CreateFrameSessionType) => {
  const collection = getCollection()

  const doc = await collection.add({
    ...newFrameSession,
    questionNumber: 1,
    createdAt: new Date()
  })

  const ref = await doc.get()

  return { id: ref.id, ...ref.data() } as FrameSessionType;

}

export const getFrameSessionById = async (id: string): Promise<FrameSessionType | null> => {
  if (!id) {
    return null
  }
  const collection = getCollection()

  const docRef = collection.doc(id)
  const doc = await docRef.get();

  if (doc.exists) {
    return { id: doc.id, ...doc.data() } as FrameSessionType;
  }

  return null
}

export const incrementSessionQuestion = async (
  id: string
): Promise<FrameSessionType | null> => {
  if (!id) {
    return null
  }

  const collection = getCollection()

  const docRef = collection.doc(id)
  const doc = await docRef.get();

  if (!doc.exists && !doc.data()) {
    return null
  }

  const currentDocumentState = doc.data() as FrameSessionType

  if (currentDocumentState.questionNumber === 3) {
    return null
  }

  await docRef.update({
    questionNumber: currentDocumentState.questionNumber + 1
  })

  const updatedSession = await docRef.get()

  return { id: updatedSession.id, ...updatedSession.data() } as FrameSessionType;
}

export const getFrameSessionFromRequest = async (
  req: NextApiRequest
) => {
  const frameSessionId = req.query.fsi

  if (!frameSessionId) {
    return null
  }

  return await getFrameSessionById(frameSessionId as string)
}
