import React from 'react'
import styles from './styles.module.css'

type Props = {
  title: string
  value: string | number
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


export const StatsContainer: React.FC<{ children: any }> = ({ children }) => {
  return (
    <div className={styles.statsContainer}>
      {children}
    </div>
  )
}
