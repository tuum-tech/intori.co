import { subDays } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { createDb } from '../pages/api/utils/firestore'
import {
    FarcasterUserType,
    FarcasterChannelType
} from '../utils/neynarApi'
import { TransactionType } from '../lib/ethers/registerCredential'
import { intoriQuestions } from '../utils/frames/intoriFrameForms'

export type UserAnswerType = {
  fid: number
  question: string
  answer: string
  date: Timestamp
  casterFid: number

  // when this answer is published to blockchain
  publicHash?: string
  publicBlockHash?: string
  publicBlockNumber?: number
}

export type UserAnswerPageType = {
  fid: number
  question: string
  answer: string
  casterFid: number
  date: {
    seconds: number
    nanoseconds: number
  }

  // when this answer is published to blockchain
  publicHash?: string
  publicBlockHash?: string
  publicBlockNumber?: number
}

export type CreateUserAnswerType = {
  fid: number
  question: string
  answer: string
  casterFid: number
}

export type SuggestionType = {
  type: 'user' | 'channel'
  user?: FarcasterUserType
  channel?: FarcasterChannelType
  reason: string[]
}

export type ChannelSuggestionType = {
  type: 'channel'
  channel: FarcasterChannelType
  reason: string[]
}

let userAnswersCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (userAnswersCollection) {
    return userAnswersCollection
  }

  const db = createDb()
  return db.collection('userAnswers')
}

export const createUserAnswer = async (newUserAnswer: CreateUserAnswerType) => {
  const collection = getCollection()

  const ref = await collection.add({
    ...newUserAnswer,
    date: new Date()
  })

  const doc = await ref.get()
  return doc.data() as UserAnswerType
}

export const getUserAnswersByFid = async (fid: number) => {
  const userAnswers: UserAnswerType[] = []

  const collection = getCollection()
  const querySnapshot = await collection
    .where('fid', '==', fid)
    .where('answer', 'not-in', ['More', '< Back', 'Next'])
    .get()

  querySnapshot.forEach((doc) => {
    userAnswers.push(doc.data() as UserAnswerType)
  })

  return userAnswers
}
export const getUserAnswerForQuestion = async (
  fid: number,
  question: string
): Promise<UserAnswerType | null> => {
  const collection = getCollection()

  const querySnapshot = await collection
  .where('fid', '==', fid)
  .where('question', '==', question)
  .get()

  for (let i = 0; i < querySnapshot.docs.length;i++) {
    if (querySnapshot.docs[i].exists) {
      return querySnapshot.docs[i].data() as UserAnswerType
    }
  }

  return null
}

export const getInitialQuestionsThatUserHasNotAnswered = async (
  fid: number
): Promise<number[]> => {
  const initialQuestions = [
    intoriQuestions[0].question,
    intoriQuestions[1].question,
    intoriQuestions[2].question
  ]

  const collection = getCollection()

  const querySnapshot = await collection
    .where('fid', '==', fid)
    .where('question', 'in', initialQuestions)
    .get();

  if (querySnapshot.empty) {
    return []
  }

  if (querySnapshot.size === 3) {
    return []
  }

  const answeredQuestions = querySnapshot.docs.map((doc) => doc.data().question)

  return initialQuestions
          .filter((question) => !answeredQuestions.includes(question))
          .map((question) => initialQuestions.indexOf(question))
}

export const countUserAnswers = async (fid: number): Promise<number> => {
  try {
    const collection = getCollection()
    const snapshot = await collection.where('fid', '==', fid).get()

    return snapshot.size
  } catch (error) {
    return -1 // Return -1 to indicate error
  }
}

const isConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const oneDay = 24 * 60 * 60 * 1000
  const diffInDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
  return diffInDays === 1
}

export const findCurrentStreak = async (fid: number): Promise<number> => {
  try {
    const collection = getCollection()
    const snapshot = await collection.where('fid', '==', fid).orderBy('date').get()

    let currentStreak = 0
    let previousDate: Date | null = null
    const today = new Date()

    for (let i = 0; i < snapshot.docs.length; i++) {
      const userAnswer = snapshot.docs[i].data() as UserAnswerType

      if (!userAnswer.date) {
        continue
      }

      const currentDate = userAnswer.date.toDate() // Assuming date is a Firestore Timestamp

      if (previousDate && !isConsecutiveDays(currentDate, previousDate)) {
        currentStreak = 0
      }

      if (isConsecutiveDays(currentDate, today) || isConsecutiveDays(currentDate, subDays(today, 1))) {
        currentStreak++
      }

      previousDate = currentDate
    }

    return currentStreak
  } catch (error) {
    return 0
  }
}

export const countSuggestedUsersAndChannels = async (
  fid: number
) => {
  const collection = getCollection()
  const userAnswers = await getUserAnswersByFid(fid)

  let totalSuggestedUsers = 0

  for (let i = 0; i < userAnswers.length; i++) {
    const userAnswer = userAnswers[i]
    const querySnapshot = await collection
      .where('question', '==', userAnswer.question)
      .where('answer', '==', userAnswer.answer)
      .limit(5)
      .get()

      totalSuggestedUsers += querySnapshot.size
  }

  return {
    totalSuggestedUsers
  }
}

export const updateUserAnswerWithBlockchainMetadata = async (
  fid: number,
  question: string,
  blockchainTranscationResult: TransactionType
) => {
  const collection = getCollection()

  const querySnapshot = await collection
    .where('fid', '==', fid)
    .where('question', '==', question)
    .get()

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i]
    await doc.ref.update({
      publicHash: blockchainTranscationResult.hash,
      publicBlockHash: blockchainTranscationResult.blockHash,
      publicBlockNumber: blockchainTranscationResult.blockNumber
    })
  }
}

export const getResponsesWithAnswerToQuestion = async (
  options: {
    question: string
    answer: string
    limit: number
  }
): Promise<UserAnswerType[]> => {
  const collection = getCollection()

  const { question, answer, limit } = options

  const querySnapshot = await collection
    .where('question', '==', question)
    .where('answer', '==', answer)
    .limit(limit)
    .get()

  return querySnapshot.docs.map((doc) => doc.data()) as UserAnswerType[]
}

export const getRecentAnswersForUser = async (fid: number, limit: number = 10) => {
  const collection = getCollection()

  const querySnapshot = await collection
    .where('fid', '==', fid)
    .orderBy('date', 'desc')
    .limit(limit)
    .get()

  return querySnapshot.docs.map((doc) => doc.data() as UserAnswerPageType)
}

export const getUniqueUserFids = async (): Promise<number> => {
  const collection = getCollection()
  const querySnapshot = await collection.get()

  const uniqueFids = new Set<number>()

  querySnapshot.forEach((doc) => {
    const userAnswer = doc.data() as UserAnswerType
    uniqueFids.add(userAnswer.fid)
  })

  return Array.from(uniqueFids).length
}

export const countUserResponses = async (): Promise<number> => {
  const collection = getCollection()
  const querySnapshot = await collection.count().get()

  return querySnapshot.data().count
}

export const countTotalResponsesForUser = async (fid: number): Promise<number> => {
  const collection = getCollection()
  const querySnapshot = await collection.where('fid', '==', fid).get()

  return querySnapshot.size
}

export const getAnswersInCommonBetweenUsers = async (
  fid1: number,
  fid2: number
): Promise<UserAnswerType[]> => {
  const collection = getCollection()

  const querySnapshot = await collection
    .where('fid', '==', fid1)
    .get()

  const user1Answers = querySnapshot.docs.map((doc) => doc.data() as UserAnswerType)

  const querySnapshot2 = await collection
    .where('fid', '==', fid2)
    .get()

  const user2Answers = querySnapshot2.docs.map((doc) => doc.data() as UserAnswerType)

  const commonAnswers = user1Answers.filter((answer1) => {
    return user2Answers.some((answer2) => {
      return answer1.question === answer2.question && answer1.answer === answer2.answer
    })
  })

  commonAnswers.sort((a, b) => {
    // most recent answers first
    return b.date.toMillis() - a.date.toMillis()
  })

  return commonAnswers
}

export const getLastAnsweredQuestionForUser = async (fid: number): Promise<UserAnswerType|null> => {
  const collection = getCollection()

  const querySnapshot = await collection
    .where('fid', '==', fid)
    .orderBy('date', 'desc')
    .limit(1)
    .get()

  if (querySnapshot.empty) {
    return null
  }

  return querySnapshot.docs[0].data() as UserAnswerType
}
