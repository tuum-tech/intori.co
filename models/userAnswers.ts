import { subDays } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { createDb } from '../pages/api/utils/firestore'
import {
    getChannelsThatUserFollows,
    fetchUserDetailsByFids,
    FarcasterUserType,
    FarcasterChannelType
} from '../utils/neynarApi'

export type UserAnswerType = {
  fid: number
  question: string
  answer: string
  date: Timestamp
}

export type UserAnswerPageType = {
  fid: number
  question: string
  answer: string
  date: {
    seconds: number
    nanoseconds: number
  }
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

export const getSuggestedUsers = async (
  fid: number,
  options?: {
    maxResults: number
  }
): Promise<SuggestionType[]> => {
  const collection = getCollection()

  const userAnswers = await getUserAnswersByFid(fid)

  const suggestedUserFids: {
    fid: number
    reason: string[]
  }[] = []

  const removeDuplicateAnswers = (arr: UserAnswerType[]): UserAnswerType[] => {
    const uniqueQuestions = new Map<string, boolean>();
    return arr.filter(item => {
      if (uniqueQuestions.has(item.question)) {
        return false;
      } else {
        uniqueQuestions.set(item.question, true);
        return true;
      }
    });
  };

  const uniqueUserAnswers = removeDuplicateAnswers(userAnswers)

  await Promise.all(
    uniqueUserAnswers.map(async (userAnswer) => {
      const querySnapshot = await collection
        .where('question', '==', userAnswer.question)
        .where('answer', '==', userAnswer.answer)
        .select('fid')
        .limit(10)
        .get()

      for (let j = 0; j < querySnapshot.docs.length; j++) {
        const suggestedUserAnswer = querySnapshot.docs[j].data() as UserAnswerType

        if (suggestedUserAnswer.fid === fid) {
          continue
        }

        const alreadySuggested = suggestedUserFids.findIndex((suggestedUser) => suggestedUser.fid === suggestedUserAnswer.fid)

        if (alreadySuggested !== -1) {
          suggestedUserFids[alreadySuggested].reason.push(`Both answered "${userAnswer.answer}" for "${userAnswer.question}"`)
          continue
        }

        suggestedUserFids.push({
          fid: suggestedUserAnswer.fid,
          reason: [
            `You both answered "${userAnswer.answer}" for "${userAnswer.question}"`
          ]
        })
      }
    })
  )

  const fids = suggestedUserFids.slice(
    0,
    options?.maxResults ?? suggestedUserFids.length
  ).map((suggestedUser) => suggestedUser.fid)

  if (!fids.length) {
    return []
  }

  const userDetails = await fetchUserDetailsByFids(fids)

  const suggestedUsers = suggestedUserFids.map((suggestedUser) => {
    const user = userDetails.find((user) => user.fid === suggestedUser.fid)

    if (!user) {
      return null
    }

    return {
      user: user as FarcasterUserType,
      type: 'user',
      reason: suggestedUser.reason
    }
  }).filter((suggestedUser) => suggestedUser !== null)

  return suggestedUsers as SuggestionType[]
}

export const getSuggestedUsersAndChannels = async (
  fid: number,
  options?: {
    maxResults: number
  }
): Promise<SuggestionType[]> => {
  const suggestedUsers = await getSuggestedUsers(fid, options)

  const allChannels: FarcasterChannelType[] = []
  const suggestedChannels: SuggestionType[] = []
  const channelCounts: Record<string, number> = {}

  await Promise.all(
    suggestedUsers.map(async (suggestion) => {
      if (!suggestion.user) {
        return
      }

      const channels = await getChannelsThatUserFollows(
        suggestion.user.fid,
        options?.maxResults || 25
      )

      for (let j = 0; j < channels.length; j++) {
        const channelId = channels[j].id

        if (!channelCounts[channelId]) {
          channelCounts[channelId] = 1
          allChannels.push(channels[j])
        } else {
          channelCounts[channelId]++
        }

      }
    })
  )

  const sortedChannelCounts = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])

  for (let i = 0; i < sortedChannelCounts.length; i++) {
    const channelId = sortedChannelCounts[i][0]

    if (sortedChannelCounts[i][1] < 2) {
      continue
    }

    const channel = allChannels.find((c) => c.id === channelId)

    if (!channel) {
      continue
    }

    suggestedChannels.push({
      type: 'channel',
      channel,
      reason: ['Users that have similar answers to you follow this channel.']
    })
  }

  return suggestedUsers.concat(suggestedChannels) as SuggestionType[]
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
