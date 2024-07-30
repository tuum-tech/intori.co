import { FrameSessionType } from '../../models/frameSession'
import {
  getUserAnswerForQuestion,
  getResponsesWithAnswerToQuestion,
  getRecentAnswersForUser,
  SuggestionType
} from '../../models/userAnswers'
import { doesUserAlreadyFollowUser } from '../../models/userFollowings'
import {
  fetchUserDetailsByFids,
  getChannelsThatUserFollows
} from '../neynarApi'

// get suggested user for frame sequence
export const getSuggestedUser = async (
  frameSession: FrameSessionType
): Promise<{
  fid: number
  user: string
  reason: string
}> => {
  if (
    !frameSession.questions ||
    frameSession.questions.length === 0
  ) {
    return {
      fid: 294394,
      user: 'intori',
      reason: 'Keep going! Your next suggestions will be sharper.'
    }
  }

  const lastQuestionAnswered = frameSession.questions[frameSession.questions.length - 1]
  const userResponse = await getUserAnswerForQuestion(frameSession.fid, lastQuestionAnswered)

  if (!userResponse) {
    return {
      fid: 294394,
      user: 'intori',
      reason: 'Keep going! Your next suggestions will be sharper.'
    }
  }

  const otherUserResponses = await getResponsesWithAnswerToQuestion({
    answer: userResponse.answer,
    question: userResponse.question,
    limit: 10
  })

  const suggestedUserFids: number[] = []

  for (let i = 0; i < otherUserResponses.length; i++) {
    const otherUserResponse = otherUserResponses[i]

    if (otherUserResponse.fid === frameSession.fid) {
      continue
    }

    const alreadySuggested = suggestedUserFids.findIndex(
      (suggestedFid) => suggestedFid === otherUserResponse.fid
    )

    if (alreadySuggested > -1) {
      continue
    }

    suggestedUserFids.push(otherUserResponse.fid)
  }

  if (!suggestedUserFids.length) {
    return {
      fid: 294394,
      user: 'intori',
      reason: 'Keep going! Your next suggestions will be sharper.'
    }
  }

  const randomUserFid = suggestedUserFids[Math.floor(Math.random() * suggestedUserFids.length)]

  const [userDetails] = await fetchUserDetailsByFids([randomUserFid])

  return {
    fid: randomUserFid,
    user: userDetails.username,
    reason: `You both answered "${userResponse.answer}" for "${userResponse.question}"`
  }
}

// get suggested channel for frame sequence
export const getSuggestedChannel = async (
  frameSession: FrameSessionType
): Promise<string> => {
  const suggestions: string[] = []

  const randomSuggestion = () => {
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  if (
    !frameSession.questions ||
    frameSession.questions.length === 0
  ) {
    suggestions.push('farcaster')
    suggestions.push('base')

    return randomSuggestion()
  }

  const lastQuestionAnswered = frameSession.questions[frameSession.questions.length - 1]

  // then, we will get groups from a suggested user
  const suggestedUser = await getSuggestedUser(frameSession)

  const channelsThatSuggestedUserFollows = await getChannelsThatUserFollows(suggestedUser.fid, 10)

  suggestions.push(
    ...channelsThatSuggestedUserFollows.map((channel) => channel.name as string)
  )

  return randomSuggestion()
}

// The 'reason' text fields here can be different since this is for the frontend app
export const getAllSuggestedUsersAndChannels = async (
  options: {
    fid: number,
    channelId?: string
    noChannel?: boolean
    usersOnly?: boolean
  }
): Promise<SuggestionType[]> => {
  const { fid, channelId, noChannel } = options
  const recentResponses = await getRecentAnswersForUser(
    fid,
    12,
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
      limit: 12
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

  if (options.usersOnly) {
    return suggestions
  }

  return suggestions
  /* Channels temporarily removed from suggestions
  const channelsToBeSuggested: {
    channel: FarcasterChannelType
    count: number
  }[] = []

  for (let i = 0; i < suggestedUserFids.length; i++) {
    const suggestedFid = suggestedUserFids[i]
    const channels = await getChannelsThatUserFollows(suggestedFid.fid, 5)

    for (let j = 0; j < channels.length; j++) {
      const channel = channels[j]
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

  return suggestions
  */
}
