import React, { useState, useCallback, useEffect } from 'react'
import { getUniqueChannelQuestionStats, UniquelyCastedQuestionStats } from '../../../requests/channelFrames'
import { OneQuestionStats, OneQuestionStatsSkeleton } from './OneQuestionStats'
import { handleError } from '../../../utils/handleError'
import styles from './styles.module.css'

type Props = {
  channelId: string
}

export const ChannelQuestionStats: React.FC<Props> = ({
  channelId
}) => {
  const [loading, setLoading] = useState(true)
  const [channelQuestions, setChannelQuestions] = useState<UniquelyCastedQuestionStats[]>([])

  const fetchQuestionStats = useCallback(async () => {
    try {
      const res = await getUniqueChannelQuestionStats(channelId)

      // sort so total responses is at top
      res.data.sort((a, b) => {
        return b.totalResponses - a.totalResponses
      })

      setChannelQuestions(res.data)
    } catch (err) {
      handleError(err, 'Something went wrong trying to fetch channel question stats. Please try again later.')
    }

    setLoading(false)
  }, [channelId])

  useEffect(() => {
    fetchQuestionStats()
  }, [fetchQuestionStats])

  if (loading) {
    return (
      <div className={styles.container}>
        { Array.from({ length: 3 }).map((_, index) => (
          <OneQuestionStatsSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {
        channelQuestions.map((questionStats) => (
          <OneQuestionStats key={questionStats.questionId} stats={questionStats} channelId={channelId} />
        ))
      }
    </div>
  )
}
