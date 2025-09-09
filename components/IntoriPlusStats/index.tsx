import React from 'react'
import { useIntoriPlusApplicationStats } from '@/requests/intoriPlusApplications'
import styles from './styles.module.css'

export const IntoriPlusStats: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useIntoriPlusApplicationStats()

  if (statsLoading) {
    return (
      <div className={styles.statsContainer}>
        <div className={styles.loadingText}>Loading stats...</div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statItem}>
        <div className={styles.statValue}>{stats.totalApplicants.toLocaleString()}</div>
        <div className={styles.statLabel}>Total Applicants</div>
      </div>
      <div className={styles.statItem}>
        <div className={`${styles.statValue} ${styles.approvedValue}`}>
          {stats.approved.toLocaleString()}
        </div>
        <div className={styles.statLabel}>Approved</div>
      </div>
      <div className={styles.statItem}>
        <div className={`${styles.statValue} ${styles.pendingValue}`}>
          {stats.pending.toLocaleString()}
        </div>
        <div className={styles.statLabel}>Pending</div>
      </div>
    </div>
  )
}
