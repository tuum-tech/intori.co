import { subDays } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { db } from '../pages/api/utils/firestore'

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

type CreateUserAnswerType = {
  fid: number
  sequence: string
  question: string
  answer: string
}

const userAnswersCollection = db.collection('userAnswers')

export const createUserAnswer = (newUserAnswer: CreateUserAnswerType) => {
  return userAnswersCollection.add({
    ...newUserAnswer,
    date: new Date()
  })
}

export const getUserAnswersByFid = async (fid: number) => {
  const userAnswers: UserAnswerType[] = []
  const querySnapshot = await userAnswersCollection.where('fid', '==', fid).get()

  querySnapshot.forEach((doc) => {
    userAnswers.push(doc.data() as UserAnswerType)
  })

  return userAnswers
}
export const getUserAnswerForQuestion = async (
  fid: number,
  question: string
): Promise<UserAnswerType | null> => {
  const querySnapshot = await userAnswersCollection
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
    const snapshot = await userAnswersCollection.where('fid', '==', fid).get()

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
    const snapshot = await userAnswersCollection.where('fid', '==', fid).orderBy('date').get()

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
