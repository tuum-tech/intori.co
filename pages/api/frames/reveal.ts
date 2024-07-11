import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import { getFrameSessionFromRequest, createFrameSession } from '../../../models/frameSession'
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
    console.log('invalid farcaster packet')
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const { fid } = frameSubmissionHelpers(req)

  let session = await getFrameSessionFromRequest(req)

  if (!session) {
    session = await createFrameSession({ fid })
  }

  if (!session) {
    console.log('no session')
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
