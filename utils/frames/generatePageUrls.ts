export const createFrameErrorUrl = (): string => {
  return '/frames/error'
}


export const createFrameResultsUrl = (params: {
  fid: number
}): string => {
  const { fid } = params
  return `/frames/results?fid=${fid}`
}

export const createFrameQuestionUrl = (params: {
  questionIndex: number
  answerOffset?: number
  frameSessionId: string
}) => {
  const { questionIndex, answerOffset, frameSessionId } = params
  return `/frames/question?qi=${questionIndex}&ioff=${answerOffset}&fsid=${frameSessionId}`
}

export const createStartNewFrameQuestionUrl = (): string => {
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
