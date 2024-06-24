import { FrameSessionType } from '../../models/frameSession'
import {
  getUserAnswerForQuestion,
  getResponsesWithAnswerToQuestion
} from '../../models/userAnswers'
import {
  fetchUserDetailsByFids,
  getChannelsThatUserFollows
} from '../neynarApi'
import { intoriQuestions } from './intoriFrameForms'

// we need to suggest users that share answers with last question
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

    if (alreadySuggested === -1) {
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
    reason: `You both answered "${userResponse.answer}"`
  }
}

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
  const questionIndex = intoriQuestions.findIndex(question => question.question === lastQuestionAnswered)

  // if one of the initial 3 questions, we want to show different suggestions
  if (questionIndex < 3) {
    const userResponse = await getUserAnswerForQuestion(frameSession.fid, lastQuestionAnswered)
    if (!userResponse) {
      suggestions.push('farcaster')
      suggestions.push('base')

      return randomSuggestion()
    }

    const { answer } = userResponse

    // seasons
    if (questionIndex === 0) {
      // always push these for the question
      suggestions.push('outside')

      switch (answer) {
        case 'Spring':
          suggestions.push('flowers', 'flora', 'sunsets', 'gardening')
          break
        case 'Summer':
          suggestions.push('surfing', 'beaches', 'sunsets', 'grilling', 'travel', 'waterscapes', 'tropicalgarden')
          break
        case 'Fall':
          suggestions.push('woodland', 'tree', 'mountains')
          break
        case 'Winter':
          suggestions.push('snow', 'skiing', 'alps', 'snowboarding', 'mountains', 'mountainlife')
          break
      }
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
    }

    if (questionIndex === 2) { // movies
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
    }

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
