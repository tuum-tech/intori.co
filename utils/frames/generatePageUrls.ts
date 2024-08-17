export const createFrameErrorUrl = (): string => {
  return '/frames/error'
}

export const createFrameResultsUrl = (params: {
  frameSessionId: string
}): string => {
  const { frameSessionId } = params
  return `${process.env.NEXTAUTH_URL}/frames/results?fsid=${frameSessionId}`
}

export const createFrameQuestionUrl = (params: {
  questionId: string
  answerOffset?: number
  frameSessionId: string
}) => {
  const queryParts: string[] = [
    `qi=${params.questionId}`,
    `fsid=${params.frameSessionId}`
  ]

  if (params.answerOffset) {
    queryParts.push(`ioff=${params.answerOffset}`)
  }

  return `${process.env.NEXTAUTH_URL}/frames/question?${queryParts.join('&')}`
}

export const createStartNewFrameQuestionUrl = (params: {
  frameSessionId?: string
  channelId?: string
  isIntroFrame?: boolean
} = {}): string => {
  const queryParts: string[] = []

  if (params.frameSessionId) {
    queryParts.push(`fsid=${params.frameSessionId}`)
  }

  if (params.channelId) {
    queryParts.push(`channelId=${params.channelId}`)
  }

  if (params.isIntroFrame) {
    queryParts.push('intro=true')
  }

  return `${process.env.NEXTAUTH_URL}/api/frames/question?${queryParts.join('&')}`
}

export const createSubmitAnswerUrl = (params: {
  questionId: string
  answerOffset: number
  frameSessionId: string
}): string => {
  const { questionId, answerOffset, frameSessionId } = params
  return `${process.env.NEXTAUTH_URL}/api/frames/answer?qi=${questionId}&ioff=${answerOffset}&fsid=${frameSessionId}`
}

export const createLimitReachedUrl = (params: {
  frameSessionId: string
}): string => {
  return `${process.env.NEXTAUTH_URL}/frames/limit?fsid=${params.frameSessionId}`
}

export const createAnsweredAllQuestionsUrl = (params: {
  frameSessionId: string
}): string => {
  return `${process.env.NEXTAUTH_URL}/frames/answered-all-questions?fsid=${params.frameSessionId}`
}

export const createSkipQuestionUrl = (params: {
  questionId: string
  frameSessionId: string
}): string => {
  const { questionId, frameSessionId } = params
  return `${process.env.NEXTAUTH_URL}/api/frames/skip?qi=${questionId}&fsid=${frameSessionId}`
}

export const createNextRevealUrl = (params: {
  fsid: string
}) => {
  const { fsid } = params
  return `${process.env.NEXTAUTH_URL}/api/frames/reveal?fsid=${fsid}`
}

export const createFollowIntoriUrl = (params: {
  fsid: string
}) => {
  const { fsid } = params
  return `${process.env.NEXTAUTH_URL}/frames/followIntori?fsid=${fsid}`
}

export const createNoMatchesFoundUrl = (params: {
  fsid: string
}) => {
  const { fsid } = params
  return `${process.env.NEXTAUTH_URL}/frames/no-matches?fsid=${fsid}`
}

export const createChannelQuestionFrameUrl = (params: {
  channelId: string
  questionId: string
}) => {
  const { channelId, questionId } = params
  return `${process.env.NEXTAUTH_URL ?? window.location.origin}/frames/channels/${channelId}/question?qid=${questionId}`
}

export const createTutorialFrameUrl = (params: {
  fsid: string
}) => {
  const { fsid } = params
  return `${process.env.NEXTAUTH_URL}/frames/tutorial?fsid=${fsid}`
}
