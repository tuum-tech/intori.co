import { createDb } from '../pages/api/utils/firestore'
import { getAllChannelFrames } from './channelFrames'

export type QuestionType = {
  id: string
  question: string
  answers: string[]
  order: number
  deleted: boolean
  topics?: string[]
}

export type CreateQuestionType = {
  id: string
  question: string
  answers: string[]
  order: number
  topics: string[]
}

let frameSessionsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (frameSessionsCollection) {
    return frameSessionsCollection
  }

  const db = createDb()
  return db.collection('questions')
}

export const createQuestion = async (newQuestion: CreateQuestionType) => {
  const collection = getCollection()

  const doc = await collection.add({
    deleted: false,
    ...newQuestion
  })

  const ref = await doc.get()

  return { id: ref.id, ...ref.data() } as QuestionType
}

export const getAllQuestions = async (): Promise<QuestionType[]> => {
  const collection = getCollection()

  let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>
  query = query.where('deleted', '==', false)

  const ref = await query.get()

  const allQuestions = ref.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as QuestionType[]

  return allQuestions.sort((a, b) => a.order - b.order)
}

export const getQuestionById = async (id: string) => {
  const collection = getCollection()

  const query = await collection.where('id', '==', id).limit(1).get()

  if (!query.size) {
    return null
  }

  return query.docs[0].data() as QuestionType
}

export const getQuestionByQuestionText = async (question: string) => {
  const collection = getCollection()

  const query = await collection.where('question', '==', question).limit(1).get()

  if (!query.size) {
    return null
  }

  return query.docs[0].data() as QuestionType
}

export const deleteQuestionById = async (id: string) => {
  const collection = getCollection()

  const doc = await collection.where('id', '==', id).get()

  await doc.docs[0].ref.set({
    deleted: true
  })
}

export const updateQuestionById = async (
  id: string,
  body: QuestionType
) => {
  const collection = getCollection()

  const doc = await collection.where('id', '==', id).get()

  if (!doc.empty) {
    await doc.docs[0].ref.delete()
  }

  return createQuestion(body)
}


export const questionAlreadyExists = async (params: {
  question: string
  excludeQuestionId?: string
}): Promise<boolean> => {
  const { question, excludeQuestionId } = params

  const collection = getCollection()

  let query = collection.where('question', '==', question)

  if (excludeQuestionId) {
    query = query.where('id', '!=', excludeQuestionId)
  }

  const ref = await query.limit(1).get()

  return !!ref.size
}

export const removeDuplicateQuestions = async () => {
  const collection = getCollection()
  const channelFrames = await getAllChannelFrames()

  const usedIntroQuestionIds: string[] = []

  for (const frame of channelFrames) {
    usedIntroQuestionIds.push(...frame.introQuestionIds)
  }

  const snapshot = await collection.get();

  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  // Step 2: Identify Duplicates
  const uniqueQuestions = new Set<string>()
  const duplicateDocs: string[] = []

  snapshot.forEach((doc) => {
    doc.ref.set({
      deleted: false
    }, { merge: true })

    const data = doc.data();
    const question = data.question;

    if (
      question &&
      uniqueQuestions.has(question) &&
      !usedIntroQuestionIds.includes(doc.id)
    ) {
      duplicateDocs.push(doc.id); // Mark as duplicate
    } else {
      uniqueQuestions.add(question); // Add to set of unique questions
    }
  });

  // Step 3: Delete Duplicate Documents
  const deletePromises = duplicateDocs.map((docId) =>
    collection.doc(docId).delete()
  );

  await Promise.all(deletePromises);
}
