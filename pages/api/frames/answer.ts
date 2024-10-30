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
  createFrameErrorUrl,
  createUnlockedInsightsUrl,
  createFrameQuestionUrl
} from '../../../utils/urls'
import { getChannelFrame } from '../../../models/channelFrames'
import { incrementSessionQuestion } from '../../../models/frameSession'

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

  // if user is not a member of channel id
  //    check if user is already a potential member
  //      if not a potential member, check number of responses in this channel

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

  if (session.isIntroFrame && session.channelId) {
    const channelFrame = await getChannelFrame(session.channelId)

    if (!channelFrame) {
      return res.redirect(
        307,
        createFrameErrorUrl()
      )
    }

    await incrementSessionQuestion(session.id)
    session.questionNumber += 1

    if (session.questionNumber === channelFrame?.introQuestionIds.length) {
      return res.redirect(
        307,
        createUnlockedInsightsUrl({
          frameSessionId: session.id
        })
      )
    }

    return res.redirect(
      307,
      createFrameQuestionUrl({
        questionId: channelFrame.introQuestionIds[session.questionNumber],
        frameSessionId: session.id
      })
    )
  }

  return res.redirect(
    307,
    createUnlockedInsightsUrl({
      frameSessionId: session.id
    })
  )
}

export default answeredQuestion
