export const createFrameErrorUrl = (): string => {
  return '/frames/error'
}

export const createFrameResultsUrl = (params: {
  fid: number,
  frameSessionId: string
}): string => {
  const { fid, frameSessionId } = params
  return `${process.env.NEXTAUTH_URL}/frames/results?fid=${fid}&fsid=${frameSessionId}`
}

export const createFrameQuestionUrl = (params: {
  questionIndex: number
  answerOffset?: number
  frameSessionId: string
}) => {
  const { questionIndex, answerOffset, frameSessionId } = params
  return `${process.env.NEXTAUTH_URL}/frames/question?qi=${questionIndex}&ioff=${answerOffset}&fsid=${frameSessionId}`
}

export const createStartNewFrameQuestionUrl = (params: {
  frameSessionId?: string
} = {}): string => {
  if (params.frameSessionId) {
    return `${process.env.NEXTAUTH_URL}/api/frames/question?fsid=${params.frameSessionId}`
  }

  return `${process.env.NEXTAUTH_URL}/api/frames/question`
}

export const createSubmitAnswerUrl = (params: {
  questionIndex: number
  answerOffset: number
  frameSessionId: string
}): string => {
  const { questionIndex, answerOffset, frameSessionId } = params
  return `${process.env.NEXTAUTH_URL}/api/frames/answer?qi=${questionIndex}&ioff=${answerOffset}&fsid=${frameSessionId}`
}

export const createLimitReachedUrl = (): string => {
  return `${process.env.NEXTAUTH_URL}/frames/limit`
}

export const createSkipQuestionUrl = (params: {
  questionIndex: number
  frameSessionId: string
}): string => {
  const { questionIndex, frameSessionId } = params
  return `${process.env.NEXTAUTH_URL}/api/frames/skip?qi=${questionIndex}&fsid=${frameSessionId}`
}
