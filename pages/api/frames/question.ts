import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import {
  countUserAnswers
} from '../../../models/userAnswers'
import { createFrameSession } from '../../../models/frameSession'
import { getChannelFrame } from '../../../models/channelFrames'
import { saveUserFollowings } from '../../../models/userFollowings'
import {
  createFrameQuestionUrl,
  createFrameErrorUrl,
  createTutorialFrameUrl
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

  // If no session, create new frame session
  let session = initialSession

  if (!session) {
    const numberOfIntoriResponses = await countUserAnswers(fid)

    session = await createFrameSession({
      fid,
      channelId,
      showTutorialFrame: numberOfIntoriResponses === 0,
      isIntroFrame: req.query.intro === 'true'
    })

    saveUserFollowings(fid)
  }

  if (!session || !channelId) {
    console.log('no session or channel id', channelId)
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

    return res.redirect(
      307,
      createFrameQuestionUrl({
        questionId: currentQuestionId,
        answerOffset: requestedAnswerOffset,
        frameSessionId: session.id
      })
    )
  }

  if (session.isIntroFrame) {
    const introQuestionIdToShow = channelFrame.introQuestionIds[session.questionNumber]

    return res.redirect(
      createFrameQuestionUrl({
        questionId: introQuestionIdToShow,
        frameSessionId: session.id
      })
    )
  }

  console.log('here, no qi query given')

  // TODO: need to think about what to do with skipped question for single question frames
  // const skippedQuestions = await getLastSkippedQuestions(fid, 5)

  return res.redirect(
    307,
    createFrameErrorUrl()
  )
}

export default newQuestion
