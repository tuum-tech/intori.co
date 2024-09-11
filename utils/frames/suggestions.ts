import {
  getResponsesWithAnswerToQuestion,
  getRecentAnswersForUser,
  SuggestionType
} from '../../models/userAnswers'
import {
  fetchUserDetailsByFids,
  getRecentCastsInChannel,
  serializeUser
} from '../neynarApi'
import { getSuggestionRating } from '../../models/suggestionRating'
import { getSuggestionDislikes } from '../../models/suggestionDislikes'
import { doesUserAlreadyFollowUser } from '../../models/userFollowings'

const getRecentlyCastedFidsInChannel = async (params: {
  channelId: string
  limit: number
}) => {
  const { channelId, limit } = params

  const recentCasts = await getRecentCastsInChannel({
    channelId,
    limit: 50
  })

  recentCasts.sort((a, b) => {
      if (a.author.power_badge && !b.author.power_badge) {
          return -1
      }

      if (!a.author.power_badge && b.author.power_badge) {
          return 1
      }

      return 0
  })

  return recentCasts.slice(0, limit).map((cast) => {
    return serializeUser(cast.author)
  })
}

export const getAllSuggestedUsersAndChannels = async (
  options: {
    fid: number,
    channelId?: string
    limit: number
  },
): Promise<SuggestionType[]> => {
  const { fid, channelId, limit } = options

  const recentResponses = await getRecentAnswersForUser(
    fid,
    9,
    {
      channelId
    })

  const dislikedSuggestions = await getSuggestionDislikes(fid)
  const dislikedFids = dislikedSuggestions.map((s) => s.dislikesFid)

  const suggestions: SuggestionType[] = []
  const suggestedUserFids: {
    fid: number
    reason: string[]
  }[] = []

  await Promise.all(
    recentResponses.map(async (response) => {
      const otherUserResponses = await getResponsesWithAnswerToQuestion({
        question: response.question,
        answer: response.answer,
        limit: 9
      })

      for (let j = 0; j < otherUserResponses.length; j++) {
        const res = otherUserResponses[j]

        if (res.fid === fid) {
          continue
        }

        if (dislikedFids.includes(res.fid)) {
          continue
        }

        const alreadySuggested = suggestedUserFids.findIndex(
          (suggestedFid) => suggestedFid.fid === res.fid
        )

        if (alreadySuggested !== -1) {
          suggestedUserFids[alreadySuggested].reason.push(
            `You both answered "${response.answer}" to "${response.question}"`
          )
          continue
        }

        suggestedUserFids.push({
          fid: res.fid,
          reason: [`You both answered "${response.answer}" to "${response.question}"`]
        })
      }
    })
  )

  const userDetails = await fetchUserDetailsByFids(
    suggestedUserFids.map((s) => s.fid)
  )

  if (suggestedUserFids.length < limit && channelId) {
    const suggestionsNeeded = limit - suggestedUserFids.length

    const usersWhoCastedRecently = await getRecentlyCastedFidsInChannel({
      channelId,
      limit: suggestionsNeeded * 4
    })

    const randomReasons = [
      "We think this account could be a great fit for you - give it a look!",
      "Explore this account, it could be a great match for your interests!",
      "Based on your interests, this account might be just what you're looking for.",
      "We think you'll find this account interesting - check it out!",
      "Your answers suggest this account might be a good fit - explore it!"
    ]

    for (let i = 0; i < usersWhoCastedRecently.length; i++) {
      const follower = usersWhoCastedRecently[i]

      if (follower.fid === fid) {
        continue
      }

      if (dislikedFids.includes(follower.fid)) {
        continue
      }

      const alreadySuggested = suggestedUserFids.findIndex(
        (suggestedFid) => suggestedFid.fid === follower.fid
      )

      if (alreadySuggested !== -1) {
        continue
      }
      
      suggestedUserFids.push({
          fid: follower.fid,
          reason: [randomReasons[i % randomReasons.length]]
      })
    }

    userDetails.push(...usersWhoCastedRecently)
  }

  const userFollowingStatuses = await Promise.all(
    suggestedUserFids.map(async (suggestedUser) => {
      const alreadyFollows = await doesUserAlreadyFollowUser(fid, suggestedUser.fid)

      console.log(fid, alreadyFollows ? 'follows' : 'does not follow', suggestedUser.fid)

      return {
        ...suggestedUser,
        alreadyFollows
      }
    })
  )

  const usersNotFollowed = userFollowingStatuses.filter((u) => !u.alreadyFollows)

  usersNotFollowed.forEach((s) => {
    suggestions.push({
      type: 'user',
      user: userDetails.find((u) => u.fid === s.fid),
      reason: s.reason
    } as SuggestionType)
  })

  await Promise.all(
    suggestions.map(async (suggestion) => {
      const rating = await getSuggestionRating(suggestion.user.fid)
      suggestion.rating = rating.rating
    })
  )

  suggestions
    .filter((suggestion) => {
      return suggestion.rating > -4
    })
    .sort((a, b) => {
      if (a.user.powerBadge && !b.user.powerBadge) {
          return -1
      }

      if (!a.user.powerBadge && b.user.powerBadge) {
          return 1
      }

      if (a.reason.length !== b.reason.length) {
          return b.reason.length - a.reason.length
      }

      return b.rating - a.rating
    })

  console.log('Total suggestions before slicing:', suggestions.length)

  return suggestions.slice(0, limit);
}
