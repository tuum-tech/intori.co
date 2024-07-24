import type { NextApiRequest, NextApiResponse } from 'next'
import {
  frameSubmissionHelpers
} from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { createUserAnswer, updateUserAnswerWithBlockchainMetadata } from '../../../models/userAnswers'
import { getBlockchainSettingsForUser } from '../../../models/userBlockchainSettings'
import { createVerifiableCredential } from '../veramo/createVerifiableCredential'
import { registerCredential } from '../../../lib/ethers/registerCredential'
import { createFrameErrorUrl, createFrameResultsUrl } from '../../../utils/frames/generatePageUrls'

const answeredQuestion = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const validFarcasterPacket = await validateFarcasterPacketMessage(req.body)

  if (!validFarcasterPacket) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }
  
  const {
    fid,
    buttonClicked,
    question,
    fidThatCastedFrame,
    session
  } = await frameSubmissionHelpers(req)

  if (!question) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  if (!session) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const userResponse = await createUserAnswer({
    fid,
    question: question.question,
    answer: buttonClicked,
    casterFid: fidThatCastedFrame,
    channelId: session.channelId ?? null
  })

  const { autoPublish } = await getBlockchainSettingsForUser(fid)

  if (autoPublish) {
    try {
      const {
        verifiableCredential,
        userDecentralizedIdentifier
      } = await createVerifiableCredential(userResponse)

      const publicTransaction = await registerCredential(verifiableCredential, userDecentralizedIdentifier)

      await updateUserAnswerWithBlockchainMetadata(fid, userResponse.question, publicTransaction)
    } catch (err) {
      console.error('Failed to publish to blockchain:', err)
    }
  }

  return res.redirect(
    307,
    createFrameResultsUrl({
      frameSessionId: session.id
    })
  )
}

export default answeredQuestion
