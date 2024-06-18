import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth"
import {
  getUserAnswerForQuestion,
  updateUserAnswerWithBlockchainMetadata
} from '../../../models/userAnswers'

// For creating VC and pushing to blockchain
import { getAgent } from '../veramo/setup'
import { registerCredential } from '../../../lib/ethers/registerCredential'
import { authOptions } from "../auth/[...nextauth]"


const publishAnswerToBlockchain = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(req, res, authOptions)

  console.log({ session })

  if (!session?.user?.fid) {
    return res.status(401).json({
      error: 'You are not logged in.'
    })
  }

  const fid = parseInt(session.user.fid, 10)
  const { answer, question } = req.body

  const userAnswer = await getUserAnswerForQuestion(fid, question)

  console.log({ userAnswer })
  if (!userAnswer || userAnswer.answer !== answer) {
    return res.status(400).json({ message: 'Response not found.' })
  }

  const agent = await getAgent({ fid })

  const userDecentralizedIdentifier = await agent.didManagerGetOrCreate({
    kms: 'local',
    provider: 'did:pkh',
    options: { network: 'eip155', chainId: '1' },
    alias: fid.toString() // pass fid as alias, too.
  })

  const credentialSubject = {
    fid,
    answer,
    question,
    casterFid: userAnswer.casterFid,
    timestamp: Date.now()
  }

  const credentialType = 'IntoriAnswerCredential'
  const credentialId = userDecentralizedIdentifier.did + fid

  const verifiableCredential = await agent.createVerifiableCredential({
    proofFormat: 'jwt',
    credential: {
      id: credentialId,
      credentialSubject,
      type: [credentialType],
      issuer: {
        id: userDecentralizedIdentifier.did
      }
    }
  })

  const blockchainTransaction = await registerCredential(
    verifiableCredential,
    userDecentralizedIdentifier
  )

  await updateUserAnswerWithBlockchainMetadata(
    fid,
    question,
    blockchainTransaction
  )

  return res.status(200).json({
    publicHash: blockchainTransaction.hash,
    publicBlockHash: blockchainTransaction.blockHash,
    publicBlockNumber: blockchainTransaction.blockNumber
  })
}

export default publishAnswerToBlockchain