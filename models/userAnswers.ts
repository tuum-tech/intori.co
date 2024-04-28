import {
  addDoc,
  getDocs,
  getDoc,
  collection,
  query,
  where,
  orderBy
} from 'firebase/firestore'

import { db } from '../utils/firestore'

type UserAnswerType = {
  fid: number
  sequence: string
  question: string
  answer: string
  date: Date
}

type CreateUserAnswerType = {
  fid: number
  sequence: string
  question: string
  answer: string
}

const userAnswersCollection = collection(db, 'userAnswers')

export const createUserAnswer = (newUserAnswer: CreateUserAnswerType) => {
  return addDoc(
    userAnswersCollection,
    {
      ...newUserAnswer,
      date: new Date()
    }
  )
}

export const getUserAnswersByFid = async (fid: number) => {
  const q = query(userAnswersCollection, where("fid", "==", fid))
  const querySnapshot = await getDocs(q)
  const userAnswers: UserAnswerType[] = []

  querySnapshot.forEach((doc) => {
    userAnswers.push(doc.data() as UserAnswerType)
  })

  return userAnswers
}
export const getUserAnswerForQuestion = async (
  fid: number,
  question: string
): Promise<UserAnswerType | null> => {
  const q = query(
    userAnswersCollection, 
    where("fid", "==", fid),
    where("question", "==", question)
  )

  const querySnapshot = await getDocs(q)

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    if (querySnapshot.docs[i].exists()) {
      return querySnapshot.docs[i].data() as UserAnswerType
    }
  }

  return null
}

export const countUserAnswers = async (fid: number): Promise<number> => {
  try {
    // Query userAnswers collection where fid equals the provided value
    const q = query(userAnswersCollection, where('fid', '==', fid))
    const snapshot = await getDocs(q)

    // Return the count of documents in the snapshot
    return snapshot.size
  } catch (error) {
    console.error('Error counting userAnswers:', error)
    return -1 // Return -1 to indicate error
  }

}

// Function to check if two dates are consecutive days
const isConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const oneDay = 24 * 60 * 60 * 1000
  const diffInDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
  return diffInDays === 1
}

export const findLongestStreak = async (fid: number): Promise<number> => {
  try {
    const findQuery = query(
      userAnswersCollection,
      where('fid', '==', fid),
      orderBy('date')
    )

    const snapshot = await getDocs(findQuery)

    let currentStreak = 0
    let longestStreak = 0
    let previousDate: Date | null = null

    snapshot.forEach(doc => {
      const userAnswer = doc.data() as UserAnswerType
      const currentDate = new Date(userAnswer.date)

      if (previousDate && isConsecutiveDays(currentDate, previousDate)) {
        currentStreak++
      } else {
        currentStreak = 1
      }

      longestStreak = Math.max(longestStreak, currentStreak)

      previousDate = currentDate
    })

    return Math.abs(longestStreak)
  } catch (error) {
    console.error('Error finding longest streak:', error)
    return 1
  }
}
