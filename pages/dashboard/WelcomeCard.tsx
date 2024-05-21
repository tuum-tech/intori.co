import React from 'react'
import styles from './Dashboard.module.css'

type Props = {
  icon: JSX.Element
  title: string
  children: React.ReactNode
}

export const WelcomeCard: React.FC<Props> = ({
  icon,
  title,
  children
}) => {
  return (
    <div className={styles.welcomeCard}>
      <div className={styles.icon}>{icon}</div>
      <h4>{title}</h4>
      <h3>{children}</h3>
    </div>
  )
}
