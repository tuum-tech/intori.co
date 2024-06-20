import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth"
import {
  updateUserAnswerWithBlockchainMetadata
} from '../../../models/userAnswers'
import { authOptions } from "../auth/[...nextauth]"

const finishPublishedResponse = async (
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

  const { question, blockchainTransaction } = req.body

  const fid = parseInt(session.user.fid, 10)

  await updateUserAnswerWithBlockchainMetadata(
    fid,
    question,
    blockchainTransaction
  )

  return res.status(200).end()
}

export default finishPublishedResponse
