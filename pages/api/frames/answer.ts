import type { NextApiRequest, NextApiResponse } from 'next'
import {
  frameSubmissionHelpers
} from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { createUserAnswer, updateUserAnswerWithBlockchainMetadata } from '../../../models/userAnswers'
import { getBlockchainSettingsForUser } from '../../../models/userBlockchainSettings'
import { createVerifiableCredential } from '../veramo/createVerifiableCredential'
import { registerCredential } from '../../../lib/ethers/registerCredential'
import {
  incrementSessionQuestion,
  getFrameSessionById,
  createFrameSession
} from '../../../models/frameSession'
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
    frameSessionId
  } = frameSubmissionHelpers(req)

  if (!question) {
    console.log('ERROR: no question found')
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  let session = await getFrameSessionById(frameSessionId)

  if (!session) {
    session = await createFrameSession({ fid })

    if (!session) {
      console.log('failed to create new frame session')
      return res.redirect(
        307,
        createFrameErrorUrl()
      )
    }
  }

  if (!session) {
    console.log('ERROR: no session created or found')
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  console.log('session: ', session)
  const successful = await incrementSessionQuestion(session.id)

  if (!successful) {
    console.log('failed to incrementSessionQuestion')
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  // const alreadyAnswered = await getUserAnswerForQuestion(fid, question.question)
  // if (alreadyAnswered) {
  //   return res.status(400).end()
  // }

  const userResponse = await createUserAnswer({
    fid,
    question: question.question,
    answer: buttonClicked,
    casterFid: fidThatCastedFrame
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
      fid,
      frameSessionId: session.id
    })
  )
}

export default answeredQuestion
