import type { NextApiRequest, NextApiResponse } from 'next'
import * as path from 'path'
import { getLastCastForUser, getRecentCastsForChannel } from '../../../utils/neynarApi'
import { countTotalResponsesForUser } from '../../../models/userAnswers'
import { getFrameSessionFromRequest } from '../../../models/frameSession'
import {
  createFrameErrorUrl
} from '../../../utils/frames/generatePageUrls'
import {
  timeAgo,
  replaceNewlinesWithSpaces,
  removeEmojis,
  shortenNumber
} from '../../../utils/textHelpers'
import { createFrameResultImage } from '../../../utils/frames/createResultFrameImage'

const createResultsFrameImageOfSuggestion = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const session = await getFrameSessionFromRequest(req)

  if (!session) {
    return res.redirect(
      307,
      createFrameErrorUrl()
    )
  }

  const suggestionsRevealed = parseInt(req.query.i?.toString() ?? '0', 10)
  const suggestion = session.suggestions[suggestionsRevealed % session.suggestions.length]

  // show frame image of a user
  if (suggestion.user) {
    const suggestedUserFid = suggestion.user.fid
    const totalResponses = await countTotalResponsesForUser(suggestedUserFid)
    const lastCast = await getLastCastForUser(suggestedUserFid)
    const lastCastTimeAgo = lastCast ? `Last cast ${timeAgo(lastCast.timestamp)}` : 'Never casted'

    const buffer = await createFrameResultImage({
      displayName: (suggestion.user.displayName
          ? removeEmojis(suggestion.user.displayName)
          : suggestion.user.username
      ),
      username: `@${suggestion.user.username}`,
      underUsernameText: `FID ${suggestion.user.fid}`,
      avatarUrl: suggestion.user.image ?? path.join(process.cwd(), 'public/assets/templates/avatar_fallback.png'),
      powerBadge: suggestion.user.powerBadge,
      topLeftText: `${totalResponses} Response${totalResponses === 1 ? '' : 's'}`,
      topRightText: lastCastTimeAgo,
      bio: (
        suggestion.user.bio
          ? removeEmojis(replaceNewlinesWithSpaces(suggestion.user.bio))
          : 'No bio'
      ),
      mainReason: suggestion.reason[0],
      underReasonText: (suggestion.reason.length > 1
        ? `+ ${suggestion.reason.length - 1} other answer${suggestion.reason.length === 2 ? '' : 's'} in common!`
        : ''
      )
    })

    // cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.setHeader('Content-Type', 'image/png')
    res.status(200).send(buffer)
  }

  if (suggestion.channel) {
    const lastCast = await getRecentCastsForChannel(suggestion.channel.id, 1)
    const lastCastTimeAgo = lastCast ? `Last cast ${timeAgo(lastCast[0].timestamp)}` : 'Never casted'

    const buffer = await createFrameResultImage({
      displayName: suggestion.channel.name || suggestion.channel.id,
      username: `/${suggestion.channel.id}`,
      avatarUrl: suggestion.channel.imageUrl ?? path.join(process.cwd(), 'public/assets/templates/avatar_fallback.png'),
      topLeftText: `${shortenNumber(suggestion.channel.followCount ?? 0)} Followers`,
      topRightText: lastCastTimeAgo,
      bio: suggestion.channel.description || 'No channel description',
      mainReason: `Many users that have similar answers to you follow this channel!`,
      underReasonText: '',
      underUsernameText: '',
      powerBadge: false,
    })

    // cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.setHeader('Content-Type', 'image/png')
    res.status(200).send(buffer)
  }

  return res.redirect(
    307,
    createFrameErrorUrl()
  )
}

export default createResultsFrameImageOfSuggestion
