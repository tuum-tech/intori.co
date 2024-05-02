import { db } from '../pages/api/utils/firestore'

export type UserAnswerType = {
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

  for (let i = 0; i < querySnapshot.docs.length; i++) {
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

// Function to check if two dates are consecutive days
const isConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const oneDay = 24 * 60 * 60 * 1000
  const diffInDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
  return diffInDays === 1
}

export const findLongestStreak = async (fid: number): Promise<number> => {
  try {
    const snapshot = await userAnswersCollection.where('fid', '==', fid).orderBy('date').get()

    let currentStreak = 0
    let longestStreak = 0
    let previousDate: Date | null = null

    snapshot.forEach(doc => {
      const userAnswer = doc.data() as UserAnswerType

      if (!userAnswer.date) {
        return
      }

      const currentDate = new Date(userAnswer.date?.seconds)

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
