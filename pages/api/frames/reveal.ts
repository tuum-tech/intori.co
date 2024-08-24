import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import {
  createFrameResultsUrl,
  createFrameErrorUrl,
  createCheckoutTheseChannelsUrl
} from '../../../utils/urls'
import { incrementSuggestionsRevealed } from '../../../models/frameSession'
import { updateSuggestionRating } from '../../../models/suggestionRating'

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

  if (req.query.rating) {
    const suggestionShown = session.suggestions[session.suggestionsRevealed]

    if (suggestionShown.user?.fid) {
      await updateSuggestionRating({
        fid: suggestionShown.user.fid,
        rating: Number(req.query.rating)
      })
    }
  }

  if (session.suggestionsRevealed + 1 === 3) {
    return res.redirect(
      307,
      createCheckoutTheseChannelsUrl()
    )
  }

  await incrementSuggestionsRevealed(session.id)

  return res.redirect(
    307,
    createFrameResultsUrl({ frameSessionId: session.id })
  )
}

export default revealNextSuggestion
