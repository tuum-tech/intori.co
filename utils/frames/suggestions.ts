import {
  getResponsesWithAnswerToQuestion,
  getRecentAnswersForUser,
  SuggestionType
} from '../../models/userAnswers'
import {
  fetchUserDetailsByFids,
  getChannelsThatUserFollows,
  FarcasterChannelType
} from '../neynarApi'

export const getAllSuggestedUsersAndChannels = async (
  options: {
    fid: number,
    channelId?: string
    noChannel?: boolean
  }
): Promise<SuggestionType[]> => {
  console.time('getAllSuggestedUsersAndChannels')
  const { fid, channelId, noChannel } = options
  const recentResponses = await getRecentAnswersForUser(
    fid,
    24,
    {
      channelId,
      noChannel
    })

  const suggestions: SuggestionType[] = []
  const suggestedUserFids: {
    fid: number
    reason: string[]
  }[] = []

  for (let i = 0; i < recentResponses.length; i++) {
    const response = recentResponses[i]

    const otherUserResponses = await getResponsesWithAnswerToQuestion({
      question: response.question,
      answer: response.answer,
      limit: 4
    })

    for (let j = 0; j < otherUserResponses.length; j++) {
      const res = otherUserResponses[j]

      if (res.fid === fid) {
        continue
      }

      // TEMPORARY: We will still show users that you follow
      //
      // const alreadyFollows = await doesUserAlreadyFollowUser(fid, res.fid)

      // if (alreadyFollows) {
      //   continue
      // }

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
  }

  if (!suggestedUserFids.length) {
    return suggestions
  }

  const userDetails = await fetchUserDetailsByFids(
    suggestedUserFids.map((s) => s.fid)
  )

  const usersToBeSuggest = suggestedUserFids.map((s) => {
    return {
      type: 'user',
      user: userDetails.find((u) => u.fid === s.fid),
      reason: s.reason
    }
  }) as SuggestionType[]

  suggestions.push(...usersToBeSuggest)

  const channelsToBeSuggested: {
    channel: FarcasterChannelType
    count: number
  }[] = []

  for (let i = 0; i < suggestedUserFids.length; i++) {
    const suggestedFid = suggestedUserFids[i]
    const channels = await getChannelsThatUserFollows(suggestedFid.fid, 5)

    for (let j = 0; j < channels.length; j++) {
      const channel = channels[j]

      if (options.channelId && channel.id === options.channelId) {
        continue
      }

      const name = channel.name as string

      const index = channelsToBeSuggested.findIndex((c) => c.channel.name === name)


      if (index === -1) {
        channelsToBeSuggested.push({
          channel,
          count: 1
        })

        continue
      }

      channelsToBeSuggested[index].count += 1
    }
  }

  channelsToBeSuggested.sort((a, b) => b.count - a.count)

  const channelsToSuggest = channelsToBeSuggested.slice(0, 5).map(
    ({ channel }) => {
      return {
        type: 'channel',
        reason: ['Users that have similar interests follow this channel'],
        channel
      } as SuggestionType
    }
  )

  suggestions.push(...channelsToSuggest)

  console.log(`Time took to get ${suggestions.length} suggestions:`)
  console.timeEnd('getAllSuggestedUsersAndChannels')
  return suggestions
}
