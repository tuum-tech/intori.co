import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth"
import {
  getUserAnswerForQuestion
} from '../../../models/userAnswers'
import { authOptions } from "../auth/[...nextauth]"

// For creating VC and pushing to blockchain
import { createVerifiableCredential } from '../veramo/createVerifiableCredential'


const publishAnswerToBlockchain = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(req, res, authOptions(req))

  if (!session?.user?.fid) {
    return res.status(401).json({
      error: 'You are not logged in.'
    })
  }

  const fid = parseInt(session.user.fid, 10)
  const { answer, question } = req.body

  const userAnswer = await getUserAnswerForQuestion(fid, question)

  if (!userAnswer || userAnswer.answer !== answer) {
    return res.status(400).json({ message: 'Response not found.' })
  }

  const {
    verifiableCredential,
    userDecentralizedIdentifier
  } = await createVerifiableCredential(userAnswer)

  return res.status(200).json({
    verifiableCredential,
    userDecentralizedIdentifier
  })
}

export default publishAnswerToBlockchain
