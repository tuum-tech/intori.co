import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import {
  createFrameResultsUrl,
  createFrameErrorUrl
} from '../../../utils/frames/generatePageUrls'

// User is requesting a new question
const revealNextSuggestion = async (
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

  const { session } = await frameSubmissionHelpers(req)

  if (!session) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  return res.redirect(
    307,
    createFrameResultsUrl({ frameSessionId: session.id })
  )
}

export default revealNextSuggestion
