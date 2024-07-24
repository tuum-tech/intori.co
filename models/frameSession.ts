import { Timestamp } from 'firebase/firestore'
import type { NextApiRequest } from 'next'
import { createDb } from '../pages/api/utils/firestore'
import { SuggestionType } from './userAnswers'

export type FrameSessionType = {
  id: string
  fid: number
  questionNumber: number
  createdAt: Timestamp
  questions: string[] // questions given in this session

  channelId?: string // the channel id that this frame session is for

  suggestions: SuggestionType[]
  suggestionsRevealed: number
  followsIntori: boolean
}

export type CreateFrameSessionType = {
  fid: number
  channelId?: string
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

  const body = {
    ...newFrameSession,
    questionNumber: 0,
    questions: [],
    createdAt: new Date(),
    suggestions: [],
    suggestionsRevealed: 0
  }

  if (!newFrameSession.channelId) {
    delete body.channelId
  }

  const doc = await collection.add(body)

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
  const frameSessionId = req.query.fsid

  if (!frameSessionId) {
    return null
  }

  return await getFrameSessionById(frameSessionId as string)
}

export const appendQuestionToFrameSession = async (
  frameSessionId: string,
  question: string
): Promise<void> => {
  const collection = getCollection()

  const docRef = collection.doc(frameSessionId)
  const doc = await docRef.get()

  if (!doc.exists) {
    return
  }

  const currentDocumentState = doc.data() as FrameSessionType

  await docRef.update({
    questions: [
      ...(currentDocumentState.questions || []),
      question
    ]
  })
}

export const getAllFrameSessionQuestionCounts = async (): Promise<number[]> => {
  const collection = getCollection()

  const querySnapshot = await collection.select('questionNumber').get()

  const counts = [0, 0, 0, 0]

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    counts[querySnapshot.docs[i].data().questionNumber]++
  }

  return counts
}

export const saveSuggestionsToFrameSession = async (
  fsid: string,
  suggestions: SuggestionType[]
): Promise<void> => {
  const collection = getCollection()

  const docRef = collection.doc(fsid)

  await docRef.update({
    suggestions
  })
}

export const saveIfUserFollowsIntori = async (
  fsid: string,
  followsIntori: boolean
): Promise<void> => {
  const collection = getCollection()

  const docRef = collection.doc(fsid)

  await docRef.update({
    followsIntori
  })
}

export const incremenetSuggestionsRevealed = async (
  fsid: string
): Promise<number> => {
  const collection = getCollection()

  const docRef = collection.doc(fsid)
  const doc = await docRef.get()

  if (!doc.exists) {
    return 1
  }

  const currentDocumentState = doc.data() as FrameSessionType

  await docRef.update({
    suggestionsRevealed: currentDocumentState.suggestionsRevealed + 1
  })

  return currentDocumentState.suggestionsRevealed + 1
}
