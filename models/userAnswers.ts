import { subDays } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { createDb } from '../pages/api/utils/firestore'
import {
    getChannelsThatUserFollows,
    fetchUserDetailsByFids,
    FarcasterUserType
} from '../utils/neynarApi'

export type UserAnswerType = {
  fid: number
  sequence: string
  question: string
  answer: string
  date: Timestamp
}

export type UserAnswerPageType = {
  fid: number
  sequence: string
  question: string
  answer: string
  date: {
    seconds: number
    nanoseconds: number
  }
}

export type CreateUserAnswerType = {
  fid: number
  sequence: string
  question: string
  answer: string
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

  return collection.add({
    ...newUserAnswer,
    date: new Date()
  })
}

export const getUserAnswersByFid = async (fid: number) => {
  const userAnswers: UserAnswerType[] = []

  const collection = getCollection()
  const querySnapshot = await collection.where('fid', '==', fid).get()

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

export const countUserAnswers = async (fid: number): Promise<number> => {
  try {
    const collection = getCollection()
    const snapshot = await collection.where('fid', '==', fid).get()

    return snapshot.size
  } catch (error) {
    console.error('Error counting userAnswers:', error)
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
    console.error('Error finding current streak:', error)
    return 0
  }
}

export const getSuggestedUsers = async (fid: number): Promise<FarcasterUserType[]> => {
  const collection = getCollection()
  const userAnswers = await getUserAnswersByFid(fid)
  const suggestedUserFids: number[] = []

  for (let i = 0; i < userAnswers.length; i++) {
    if (suggestedUserFids.length >= 3) {
      break
    }
    const userAnswer = userAnswers[i]
    const querySnapshot = await collection
      .where('question', '==', userAnswer.question)
      .where('answer', '==', userAnswer.answer)
      .limit(5)
      .get()

    for (let j = 0; j < querySnapshot.docs.length; j++) {
      const suggestedUserAnswer = querySnapshot.docs[j].data() as UserAnswerType

      if (
        suggestedUserAnswer.fid !== fid &&
        !suggestedUserFids.includes(suggestedUserAnswer.fid)
      ) {
        suggestedUserFids.push(suggestedUserAnswer.fid)
      }
    }
  }

  const fids = suggestedUserFids.slice(0, 3)
  return fetchUserDetailsByFids(fids)
}

export const getSuggestedUsersAndChannels = async (fid: number) => {
  const suggestedUsers = await getSuggestedUsers(fid)

  const allChannels = []
  const suggestedChannels = []
  const channelCounts: Record<string, number> = {}

  for (let i = 0; i < suggestedUsers.length; i++) {
    const user = suggestedUsers[i]
    const channels = await getChannelsThatUserFollows(user.fid, 3)

    for (let j = 0; j < channels.length; j++) {
      const channelId = channels[j].id

      if (!channelCounts[channelId]) {
        channelCounts[channelId] = 1
      } else {
        channelCounts[channelId]++
      }

      allChannels.push(channels[j])
    }
  }

  const sortedChannelCounts = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])

  for (let i = 0; i < sortedChannelCounts.length; i++) {
    const channelId = sortedChannelCounts[i][0]
    const channel = allChannels.find((c) => c.id === channelId)

    suggestedChannels.push(channel)
  }

  return {
    suggestedUsers,
    suggestedChannels
  }
}
