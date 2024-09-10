import {
  getResponsesWithAnswerToQuestion,
  getRecentAnswersForUser,
  SuggestionType
} from '../../models/userAnswers'
import {
  fetchUserDetailsByFids,
  getFollowersOfChannel
} from '../neynarApi'
import { getSuggestionRating } from '../../models/suggestionRating'
import { getSuggestionDislikes } from '../../models/suggestionDislikes'
import { doesUserAlreadyFollowUser } from '../../models/userFollowings'

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
  const dislikedFids = dislikedSuggestions.map((s) => s.fid)

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

        const alreadyFollowing = await doesUserAlreadyFollowUser(fid, res.fid)
        if (alreadyFollowing) {
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

    const channelFollowers = await getFollowersOfChannel({
      channelId,
      limit: suggestionsNeeded * 3
    })

    const randomReasons = [
      "We think this account could be a great fit for you - give it a look!",
      "Explore this account, it could be a great match for your interests!",
      "Based on your interests, this account might be just what you're looking for.",
      "We think you'll find this account interesting - check it out!",
      "Your answers suggest this account might be a good fit - explore it!"
    ]

    for (let i = 0; i < channelFollowers.length; i++) {
      const follower = channelFollowers[i]

      if (follower.fid === fid) {
        continue
      }

      if (dislikedFids.includes(follower.fid)) {
        continue
      }

      const alreadyFollowing = await doesUserAlreadyFollowUser(fid, follower.fid)
      if (alreadyFollowing) {
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

    userDetails.push(...channelFollowers)
  }

  suggestedUserFids.forEach((s) => {
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

  // code to get channel suggestions below:
  // if (channelId && channelId !== 'welcome') {
  //   return suggestions
  // }

  // const channelsToBeSuggested: FarcasterChannelType[] = []

  // await Promise.all(
  //   suggestedUserFids.map(async (suggestedUser) => {
  //     const channels = await getChannelsThatUserFollows(suggestedUser.fid, 5)

  //     for (let j = 0; j < channels.length; j++) {
  //       const channel = channels[j]

  //       if (options.channelId && channel.id === options.channelId) {
  //         continue
  //       }

  //       channelsToBeSuggested.push(channel)
  //     }
  //   })
  // )

  // const channelCounts: Record<string, { count: number, channel: FarcasterChannelType }> = {};

  // channelsToBeSuggested.forEach(channel => {
  //     if (channelCounts[channel.id]) {
  //         channelCounts[channel.id].count++;
  //     } else {
  //         channelCounts[channel.id] = { count: 1, channel };
  //     }
  // });

  // const channelsToSuggest = Object.values(channelCounts)
  //     .sort((a, b) => b.count - a.count)
  //     .slice(0, 5)
  //     .map( ({ channel }) => {
  //       return {
  //         type: 'channel',
  //         reason: ['Users that have similar interests follow this channel'],
  //         channel
  //       } as SuggestionType
  //     })

  // suggestions.push(...channelsToSuggest)

  // return suggestions
}
