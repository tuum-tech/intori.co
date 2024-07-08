import { FrameSessionType } from '../../models/frameSession'
import {
  getUserAnswerForQuestion,
  getResponsesWithAnswerToQuestion,
  getRecentAnswersForUser,
  SuggestionType
} from '../../models/userAnswers'
import {
  fetchUserDetailsByFids,
  getChannelsThatUserFollows,
  FarcasterChannelType
} from '../neynarApi'
import {
  intoriQuestions,
  isInitialQuestion
} from './intoriFrameForms'

const getSuggestedChannelsForInitialQuestion = (
  question: string, 
  answer: string
): string[] => {
  const questionIndex = intoriQuestions.findIndex(q => q.question === question)
  const suggestions: string[] = []

  if (questionIndex >= 3) {
    return []
  }

  if (questionIndex === 0) {
    // always push these for the question
    suggestions.push('food')

    switch (answer) {
      case 'Italian':
        suggestions.push('pizza', 'base-it')
        break
      case 'Mexican':
        suggestions.push('taco-tuesday')
        break
      case 'Japanese':
        suggestions.push('sakura')
        break
      case 'Thai':
        suggestions.push('sakura')
        break
      case 'Korean':
        suggestions.push('sakura')
        break
    }

    return suggestions
  }

  // music
  if (questionIndex === 1) {
    suggestions.push('music','spotify', 'albumoftheday')

    switch (answer) {
      case 'Pop':
        suggestions.push('kpop', 'audiophile')
        break
      case 'Rock':
        suggestions.push('rock', 'audiophile')
        break
      case 'Latin':
        suggestions.push('latinmusic')
        break
      case 'Classical':
        suggestions.push('classical')
        break
      case 'Electronic':
        suggestions.push('electronic', 'housemusic', 'techno', 'campfire')
        break
      case 'Hip-Hop':
        suggestions.push('rap')
        break
      case 'Country':
        suggestions.push('countrymusic')
        break
    }

    return suggestions
  }

  // movies
  suggestions.push('movies', 'screens', 'moviefortonight', 'popcorn', 'best-movies')

  switch (answer) {
    case 'Horror':
      suggestions.push('horror')
      break
    case 'Sci-Fi':
      suggestions.push('scifi', 'starwars', 'star-trek')
      break
    case 'Animation':
      suggestions.push('disney', 'anime')
      break
  }

  return suggestions
}

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
    console.log('No questions answered yet')
    console.log(frameSession)
    return {
      fid: 294394,
      user: 'intori',
      reason: 'Keep going! Your next suggestions will be sharper.'
    }
  }

  const lastQuestionAnswered = frameSession.questions[frameSession.questions.length - 1]
  const userResponse = await getUserAnswerForQuestion(frameSession.fid, lastQuestionAnswered)

  if (!userResponse) {
    console.log('No questions answered yet')
    console.log(lastQuestionAnswered)
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
  console.log({ otherUserResponses })

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
    console.log(' no suggested user fids ')
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
    reason: `You both answered "${userResponse.answer}"`
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

  // if one of the initial 3 questions, we want to show different suggestions
  if (isInitialQuestion(lastQuestionAnswered)) {
    const userResponse = await getUserAnswerForQuestion(frameSession.fid, lastQuestionAnswered)
    if (!userResponse) {
      suggestions.push('farcaster')
      suggestions.push('base')

      return randomSuggestion()
    }

    const { answer } = userResponse
    const initialQuestionSuggestions = getSuggestedChannelsForInitialQuestion(lastQuestionAnswered, answer)

    suggestions.push(...initialQuestionSuggestions)

    return randomSuggestion()
  }

  // then, we will get groups from a suggested user
  const suggestedUser = await getSuggestedUser(frameSession)

  const channelsThatSuggestedUserFollows = await getChannelsThatUserFollows(suggestedUser.fid, 10)

  suggestions.push(
    ...channelsThatSuggestedUserFollows.map((channel) => channel.name as string)
  )

  return randomSuggestion()
}

// The 'reason' text fields here can be different since this is for the frontend app
export const getAllSuggestedUSersAndChannels = async (
  options: {
    fid: number
  }
): Promise<SuggestionType[]> => {
  const { fid } = options
  const recentResponses = await getRecentAnswersForUser(fid, 12)

  const suggestions: SuggestionType[] = []
  const suggestedUserFids: {
    fid: number
    reason: string[]
  }[] = []

  for (let i = 0; i < recentResponses.length; i++) {
    const response = recentResponses[i]

    if (isInitialQuestion(response.question)) {
      const initialQuestionSuggestions = getSuggestedChannelsForInitialQuestion(
        response.question,
        response.answer
      )

      const channelSuggestions = initialQuestionSuggestions.map((ch) => {
        return {
          type: 'channel',
          channel: {
            id: ch,
            name: ch
          },
          reason: [`You answered "${response.answer}"`]
        } as SuggestionType
      })

      suggestions.push(...channelSuggestions)
    }

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
}
