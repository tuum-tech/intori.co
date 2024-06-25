import { getRecentAnswersForUser } from '../../models/userAnswers'

const convertSecondsToDate = (seconds: number): Date => {
  return new Date(seconds * 1000)
}

export const hasUserReachedSixAnswerLimit = async (fid: number): Promise<boolean> => {
  const pastSixAnswers = await getRecentAnswersForUser(fid, 6)

  if (pastSixAnswers.length < 6) {
    return false
  }

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  for (const response of pastSixAnswers) {
    const date = convertSecondsToDate(response.date.seconds)

    if (date < twentyFourHoursAgo) {
      return false
    }
  }

  return true
}
