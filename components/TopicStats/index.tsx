import React from 'react'
import { useTopicStats } from '@/hooks/useTopicStats'
import styles from './styles.module.css'

interface TopicStatsProps {
  topic: string
}

export const TopicStats: React.FC<TopicStatsProps> = ({ topic }) => {
  const { data: stats, isLoading, error } = useTopicStats(topic)

  if (!topic) {
    return (
      <div className={styles.container}>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading stats for &quot;{topic}&quot;...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error loading stats: {error.message}</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No stats available for &quot;{topic}&quot;</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Topic: {stats.topic}</h3>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Users:</span>
          <span className={styles.statValue}>{stats.usersUnlocked.toLocaleString()}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Average Spam Score:</span>
          <span className={styles.statValue}>{stats.averageSpamScore}</span>
        </div>
      </div>
    </div>
  )
}
