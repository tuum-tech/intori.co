import React from 'react'
import { Skeleton } from '../common/Skeleton'
import styles from './styles.module.css'

type Props = {
  title: string
  value: string | number
}

export const LoadingStatsCard: React.FC<{ title: string }> = ({
  title
}) => {
    return (
      <div className={styles.statsCard}>
        <h6>{title}</h6>
        <h3>
          <Skeleton width={Math.floor(Math.random() * (200 - 120 + 1)) + 120} />
        </h3>
      </div>
    )
}

export const StatsCard: React.FC<Props> = ({
  title,
  value
}) => {
    return (
      <div className={styles.statsCard}>
        <h6>{title}</h6>
        <h3>{value}</h3>
      </div>
    )
}

export const StatsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.statsContainer}>
      {children}
    </div>
  )
}

export const StatsChartContainer: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className={styles.statsChartContainer}>
      <h6>{title}</h6>
      <div>
        {children}
      </div>
    </div>
  )
}

export const SmallStatsChartContainer: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className={styles.smallStatsChartContainer}>
      <h6>{title}</h6>
      <div>
        {children}
      </div>
    </div>
  )
}
