import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import {
  countUserAnswers
} from '../../../models/userAnswers'
import { createFrameSession } from '../../../models/frameSession'
import { getChannelFrame } from '../../../models/channelFrames'
import { saveUserFollowings } from '../../../models/userFollowings'
import { didUserSkipQuestion } from '../../../models/userQuestionSkip'
import { getQuestionById } from '../../../models/questions'
import {
  createFrameQuestionUrl,
  createFrameErrorUrl,
  createTutorialFrameUrl,
  createUnlockedInsightsUrl
} from '../../../utils/urls'

// User is requesting a new question
// TODO: need to determine if user is on intro frame or a single question frame.
// we are given a qid questionId
const newQuestion = async (
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

  const { fid, channelId, session: initialSession } = await frameSubmissionHelpers(req)

  if (!channelId) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const channelFrame = await getChannelFrame(channelId)

  if (!channelFrame) {
    console.log('no channel frame', channelId)
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  // If no session, create new frame session
  let session = initialSession

  if (!session) {
    const numberOfIntoriResponses = await countUserAnswers(fid)

    const sessionQuestionIds = []

    const isIntroFrame = req.query.intro === 'true'

    if (isIntroFrame) {
      sessionQuestionIds.push(...channelFrame.introQuestionIds)
    } else if (req.query.qi) {
      sessionQuestionIds.push(req.query.qi.toString())
    } else {
      console.error('Not an intro frame or question id given')
      return res.redirect(
        307,
        createFrameErrorUrl()
      )
    }

    session = await createFrameSession({
      fid,
      channelId,
      isIntroFrame,
      showTutorialFrame: numberOfIntoriResponses === 0,
      questionIds: sessionQuestionIds
    })

    saveUserFollowings(fid)
  }

  if (!session) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }


  if (session.showTutorialFrame) {
    // if not intro frame, tutorial frame needs to know which question id to go to next
    return res.redirect(
      307,
      createTutorialFrameUrl({
        fsid: session.id,
        questionId: session.isIntroFrame ? undefined : req.query.qi as string
      })
    )
  }

  // getting next answer offset to see more answers of an already given question
  if (req.query.qi) {
    const currentQuestionId = req.query.qi as string
    const requestedAnswerOffset = parseInt(req.query.ioff as string || '0', 10)

    const question = await getQuestionById(currentQuestionId)

    if (!question) {
      return res.redirect(
        307,
        createFrameErrorUrl()
      )
    }

    const questionIsSkipped = await didUserSkipQuestion(
      fid, 
      question.question
    )

    if (!questionIsSkipped) {
      return res.redirect(
        307,
        createFrameQuestionUrl({
          questionId: currentQuestionId,
          answerOffset: requestedAnswerOffset,
          frameSessionId: session.id
        })
      )
    }
  }

  if (session.isIntroFrame) {
    if (session.questionNumber === channelFrame.introQuestionIds.length) {
      return res.redirect(
        307,
        createUnlockedInsightsUrl({
          frameSessionId: session.id
        })
      )
    }

    const introQuestionIdToShow = channelFrame.introQuestionIds[session.questionNumber]

    return res.redirect(
      createFrameQuestionUrl({
        questionId: introQuestionIdToShow,
        frameSessionId: session.id
      })
    )
  }

  return res.redirect(
    307,
    createFrameErrorUrl()
  )
}

export default newQuestion
