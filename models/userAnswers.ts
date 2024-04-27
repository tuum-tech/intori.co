import {
  addDoc,
  getDocs,
  getDoc,
  collection,
  query,
  where
} from 'firebase/firestore';

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
  return addDoc(userAnswersCollection, newUserAnswer)
}

export const getUserAnswersByFid = async (fid: number) => {
  const q = query(userAnswersCollection, where("fid", "==", fid));
  const querySnapshot = await getDocs(q);
  const userAnswers: UserAnswerType[] = [];

  querySnapshot.forEach((doc) => {
    userAnswers.push(doc.data() as UserAnswerType);
  });

  return userAnswers;
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

  const querySnapshot = await getDocs(q);

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    if (querySnapshot.docs[i].exists()) {
      return querySnapshot.docs[i].data() as UserAnswerType
    }
  }

  return null
}
