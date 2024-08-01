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

  await Promise.all(
    recentResponses.map(async (response) => {
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
    })
  )

  if (!suggestedUserFids.length) {
    return suggestions
  }

  const userDetails = await fetchUserDetailsByFids(
    suggestedUserFids.map((s) => s.fid)
  )

  suggestedUserFids.forEach((s) => {
    suggestions.push({
      type: 'user',
      user: userDetails.find((u) => u.fid === s.fid),
      reason: s.reason
    } as SuggestionType)
  })

  if (channelId && channelId !== 'welcome') {
    return suggestions
  }

  const channelsToBeSuggested: FarcasterChannelType[] = []

  await Promise.all(
    suggestedUserFids.map(async (suggestedUser) => {
      const channels = await getChannelsThatUserFollows(suggestedUser.fid, 5)

      for (let j = 0; j < channels.length; j++) {
        const channel = channels[j]

        if (options.channelId && channel.id === options.channelId) {
          continue
        }

        channelsToBeSuggested.push(channel)
      }
    })
  )

  const channelCounts: Record<string, { count: number, channel: FarcasterChannelType }> = {};

  channelsToBeSuggested.forEach(channel => {
      if (channelCounts[channel.id]) {
          channelCounts[channel.id].count++;
      } else {
          channelCounts[channel.id] = { count: 1, channel };
      }
  });

  const channelsToSuggest = Object.values(channelCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map( ({ channel }) => {
        return {
          type: 'channel',
          reason: ['Users that have similar interests follow this channel'],
          channel
        } as SuggestionType
      })

  suggestions.push(...channelsToSuggest)

  console.log(`Time took to get ${suggestions.length} suggestions:`)
  console.timeEnd('getAllSuggestedUsersAndChannels')
  return suggestions
}

// This will setup 3 users, then show 1 channel, then another 3 users, 1 channel...and so on
export const sortSuggestions = (suggestions: SuggestionType[]): SuggestionType[] => {
    const users: SuggestionType[] = [];
    const channels: SuggestionType[] = [];

    suggestions.forEach(suggestion => {
        if (suggestion.user) {
            users.push(suggestion);
        } else if (suggestion.channel) {
            channels.push(suggestion);
        }
    });

    const interleaved: SuggestionType[] = [];
    let userIndex = 0;
    let channelIndex = 0;

    while (userIndex < users.length || channelIndex < channels.length) {
        // Add up to 3 users
        for (let i = 0; i < 3 && userIndex < users.length; i++) {
            interleaved.push(users[userIndex++]);
        }

        // Add 1 channel
        if (channelIndex < channels.length) {
            interleaved.push(channels[channelIndex++]);
        }
    }

    return interleaved;
}
