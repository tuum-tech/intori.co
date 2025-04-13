import { subDays } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { createDb } from '../pages/api/utils/firestore'
import {
    FarcasterUserType,
    FarcasterChannelType
} from '../utils/neynarApi'
import { TransactionType } from '../lib/ethers/registerCredential'

export type UserAnswerType = {
  fid: number
  question: string
  answer: string
  date: Timestamp
  casterFid: number
  channelId: string | null

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
  channelId: string | null
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
  channelId: string | null
}

export type SuggestionType = {
  type: 'user'
  user: FarcasterUserType
  reason: string[]
  rating: number
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

const deleteUserResponsesForQuestion = async (
  fid: number,
  question: string
) => {
  const collection = getCollection()

  const querySnapshot = await collection
    .where('fid', '==', fid)
    .where('question', '==', question)
    .get()

  querySnapshot.forEach((doc) => {
    doc.ref.delete()
  })
}

export const createUserAnswer = async (newUserAnswer: CreateUserAnswerType) => {
  const collection = getCollection()

  const body = {
    ...newUserAnswer,
    date: new Date()
  }

  await deleteUserResponsesForQuestion(
    newUserAnswer.fid,
    newUserAnswer.question
  )

  // force channelId to be null in the db
  if (!newUserAnswer.channelId) {
    body.channelId = null
  }

  const ref = await collection.add(body)

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

export const getRecentAnswersForUser = async (
  fid: number,
  limit: number = 10,
  filters: {
    channelId?: string
    noChannel?: boolean
  } = {}
) => {
  const collection = getCollection()

  let query = collection.where('fid', '==', fid)

  if (filters.channelId) {
    query = query.where('channelId', '==', filters.channelId)
  } else if (filters.noChannel) {
    query = query.where('channelId', '==', null)
  }

  query = query.orderBy('date', 'desc').limit(limit)

  const snapshot = await query.get()

  return snapshot.docs.map((doc) => doc.data() as UserAnswerPageType)
}

export const getUniqueUserFids = async (channelId?: string): Promise<number> => {
  const collection = getCollection()

  let query = collection.select('fid')

  if (channelId) {
    query = query.where('channelId', '==', channelId)
  }

  const querySnapshot = await query.get()

  const uniqueFids = new Set<number>()

  querySnapshot.forEach((doc) => {
    const userAnswer = doc.data() as UserAnswerType
    uniqueFids.add(userAnswer.fid)
  })

  return Array.from(uniqueFids).length
}

export const countUserResponses = async (channelId?: string): Promise<number> => {
  const collection = getCollection()

  let query = collection.select('fid')

  if (channelId) {
    query = query.where('channelId', '==', channelId)
  }

  const querySnapshot = await query.count().get()

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

export const getAllUserResponses = async (params: {
  channelId?: string
} = {}) => {
  const collection = getCollection()
  let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>

  if (params.channelId) {
    query = query.where('channelId', '==', params.channelId)
  }

  const querySnapshot = await query.get()

  return querySnapshot.docs.map(
    (doc) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { answer, date, ...rest } = doc.data() as UserAnswerType
      return {
        ...rest,
        date: new Date(date.seconds * 1000).toISOString().split('T')[0]
      }
    }
  ).sort((a, b) => {
    // most recent answers first
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export const getRecentUserResponseFids = async (
  filters: {
    channelId?: string
    excludeFid?: number
  },
  options: {
    limit: number
    offset: number
  }
): Promise<number[]> => {
  const collection = getCollection()

  let query = collection.orderBy('date', 'desc')

  if (filters.channelId) {
    query = query.where('channelId', '==', filters.channelId)
  }

  if (filters.excludeFid) {
    query = query.where('fid', '!=', filters.excludeFid)
  }

  query = query.offset(options.offset).limit(options.limit).select('fid')
  
  const querySnapshot = await query.get()

  return querySnapshot.docs.map((doc) => doc.data().fid)
}

export const getUniqueUsersOverTime = async (options: {
  startDate: Date
  endDate: Date
  channelId?: string
}): Promise<Array<{ date: Date, uniqueUsers: number }>> => {
  const { startDate, endDate, channelId } = options
  try {
      const collection = getCollection()

      let query = collection
          .where('date', '>=', startDate)
          .where('date', '<=', endDate)

      if (channelId) {
        query = query.where('channelId', '==', channelId)
      }

      const snapshot = await query.get()
      
      if (snapshot.empty) {
          return [];
      }

      // Process the data
      const dateUserMap = new Map();

      snapshot.forEach(doc => {
          const data = doc.data() as UserAnswerType
          const date = data.date.toDate().toISOString().split('T')[0]; // Group by day
          const fid = data.fid;

          if (!dateUserMap.has(date)) {
              dateUserMap.set(date, new Set());
          }
          
          dateUserMap.get(date).add(fid);
      });

      // Prepare data for chart
      const chartData = Array.from(dateUserMap.entries()).map(([date, userSet]) => {
          return {
              date,
              uniqueUsers: userSet.size
          };
      });

      // Sort the data by date
      chartData.sort((a, b) => a.date.seconds - b.date.seconds)

      return chartData;
  } catch (error) {
      console.error('Error querying user answers:', error);
      throw error;
  }
}

export const getQuestionsAnsweredOverTime = async (options: {
  startDate: Date
  endDate: Date
  channelId?: string
}) => {
  const { startDate, endDate, channelId } = options
  try {
    const collection = getCollection()

    let query = collection
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)

    if (channelId) {
      query = query.where('channelId', '==', channelId)
    }

    const snapshot = await query.get()

    if (snapshot.empty) {
      return [];
    }

    // Process the data
    const dateQuestionMap = new Map();

    snapshot.forEach(doc => {
      const data = doc.data() as UserAnswerType
      const date = data.date.toDate().toISOString().split('T')[0]; // Group by day

      if (!dateQuestionMap.has(date)) {
        dateQuestionMap.set(date, 1)
      }

      dateQuestionMap.set(date, dateQuestionMap.get(date) + 1)
    });

    // Prepare data for chart
    const chartData = Array.from(
      dateQuestionMap.entries()
    ).map(([date, questionCount]) => {
      return {
        date,
        questionsAnswered: questionCount
      };
    });

    chartData

    // Sort the data by date
    chartData.sort((a, b) => a.date.seconds - b.date.seconds)

    return chartData;
  } catch (error) {
    console.error('Error querying user answers:', error);
    throw error;
  }
}

export const getMostAnsweredQuestions = async (options: {
  channelId?: string
}) => {
  const { channelId } = options
  try {
    const collection = getCollection()

    let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>

    if (channelId) {
      query = query.where('channelId', '==', channelId)
    }

    const snapshot = await query.get()

    if (snapshot.empty) {
      return [];
    }

    // Process the data
    const questionCountMap = new Map();

    snapshot.forEach(doc => {
      const data = doc.data() as UserAnswerType
      const question = data.question;

      if (!questionCountMap.has(question)) {
        questionCountMap.set(question, 1)
      }

      questionCountMap.set(question, questionCountMap.get(question) + 1)
    });

    // Prepare data for chart
    const chartData = Array.from(questionCountMap.entries()).map(([question, answerCount]) => {
      return {
        question,
        answers: answerCount
      };
    });

    // Sort the data by answer count
    chartData.sort((a, b) => b.answers - a.answers)

    return chartData.slice(0, 10);
  } catch (error) {
    console.error('Error querying user answers:', error);
    throw error;
  }
}

//    {
//      question: string
//      answerCounts: [
//        { answer: string, count: number }
//      ]
//    }
export const countUserAnswersForQuestion = async (question: string, options: {
  channelId: string
}): Promise<Array<{ answer: string, count: number }>> => {
  try {
    const collection = getCollection()
    let query = collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>

    if (options.channelId) {
      query = query.where('channelId', '==', options.channelId)
    }

    query = query.where('question', '==', question)

    const snapshot = await query.get()

    if (snapshot.empty) {
      return []
    }

    const answerCountMap = new Map<string, number>()
    
    snapshot.forEach(doc => {
      const data = doc.data() as UserAnswerType
      const answer = data.answer

      if (!answerCountMap.has(answer)) {
        answerCountMap.set(answer, 0)
      }

      answerCountMap.set(answer, (answerCountMap.get(answer) ?? 0) + 1)
    })

    return Array.from(answerCountMap.entries()).map(([answer, count]) => {
      return { answer, count }
    })
  } catch (error) {
    return []
  }
}
